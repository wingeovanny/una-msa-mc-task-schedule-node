import { Configurations } from './../../providers/report-configuration/interfaces/configuration';
import { getHour } from './../../utils/date';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportConfigurationProvider } from '../../providers/report-configuration/configuration.provider';
import { ReportsDbService } from '../../db/reports/reports.service';
import { FREQUENCY_STRATEGIES } from '../../utils/strategy/strategies-object';
import { ClientKafka } from '@nestjs/microservices';
import { CreateReportsDto, UpdateReportsDto } from './reports.dto';
import { SEND_MAIL_REPORT_MERCHANT } from '../../constants/common';
import { Logger } from '@deuna/node-logger-lib';
import { publishToQueue } from '@deuna/node-shared-lib';
import { ReportControlSend } from '../../db/reports/report-control-send.entity';

@Injectable()
export class ReportsService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly providerConfiguration: ReportConfigurationProvider,
    private readonly dbService: ReportsDbService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'generateReports' })
  async generateReportsMerchants() {
    const configs = await this.getReportsConfig();

    for (const itemReport of configs) {
      const localReport = await this.getDataFromControlSend(itemReport.id);
      const shouldSendMail = await this.shouldSendEmail(
        itemReport,
        localReport,
      );
      if (shouldSendMail) {
        this.recordSendMailKafka(itemReport);
        this.registerSendMailDbControl(itemReport, localReport);
      }
    }

    // console.log('Called when the current second is 10', configs);
  }

  async getReportsConfig() {
    const hour = getHour();
    return this.providerConfiguration.getConfigReportByHour(hour);
  }

  async getDataFromControlSend(id: string): Promise<ReportControlSend> {
    return this.dbService.findOne(id);
  }

  async shouldSendEmail(
    itemReport: Configurations,
    localReport: ReportControlSend,
  ): Promise<boolean> {
    const { daysFrequency, cutOffDay } = itemReport;

    if (localReport) {
      return this.shouldSendEmailConfig(
        daysFrequency,
        +cutOffDay,
        localReport.lastSend,
      );
    } else {
      return this.shouldSendEmailConfig(daysFrequency, +cutOffDay);
    }
  }

  shouldSendEmailConfig(
    frequency: string,
    cutOffDay: number,
    lastSentDate?: Date,
  ): boolean {
    const currentDate = new Date();
    const strategy = FREQUENCY_STRATEGIES.find((s) => s.name === frequency);
    if (!strategy) {
      return false;
    }
    return strategy.shouldSendEmail(currentDate, cutOffDay, lastSentDate);
  }

  async recordSendMailKafka(dataMailReport: Configurations): Promise<void> {
    this.logger.log(`Writing in the ${SEND_MAIL_REPORT_MERCHANT} topic`);
    try {
      await publishToQueue(this.kafkaClient, {
        topic: SEND_MAIL_REPORT_MERCHANT,
        value: { configMail: dataMailReport },
        headers: {
          source: '@lxba/bo-mc-task-schedule',
          timestamp: new Date().toISOString(),
        },
      });
      //console.log('Respuesta kafka !!!!!', res);
    } catch {
      // console.log('KAFKA error !!!!!', error);
    }
  }

  registerSendMailDbControl(
    itemReport: Configurations,
    localReport: ReportControlSend,
  ) {
    if (localReport) {
      this.updateReportsDbControl(localReport.id, itemReport);
    } else {
      this.createReportsDbControl(itemReport);
    }
  }

  async createReportsDbControl(reportCreate: Configurations): Promise<void> {
    const data = this.buildCreateReportsDto(reportCreate);
    await this.dbService.create(data);
  }

  buildCreateReportsDto(reportCreate: Configurations): CreateReportsDto {
    const {
      merchantId,
      id,
      type,
      level,
      daysFrequency,
      cutOffDay,
      cutOffTime,
      createdBy,
    } = reportCreate;

    return {
      merchantId,
      reportId: id,
      type,
      level,
      lastSend: new Date(),
      daysFrequency,
      cutOffDay,
      cutOffTime,
      createdBy,
    };
  }

  async updateReportsDbControl(id: string, dataReport: Configurations) {
    const data: UpdateReportsDto = {
      daysFrequency: dataReport.daysFrequency,
      cutOffDay: dataReport.cutOffDay,
      cutOffTime: dataReport.cutOffTime,
      lastSend: new Date(),
      updatedBy: 'jobsReports',
    };

    await this.dbService.update(id, data);
  }

  /* @EventPattern(SEND_MAIL_REPORT_MERCHANT)
     public hearLogTransaction(@Payload() responseConfigMailKafka: any) {
       console.log('LECTURA... ', responseConfigMailKafka);
       //const jsonString = JSON.stringify(responseConfigMailKafka);
     }
     */
}
