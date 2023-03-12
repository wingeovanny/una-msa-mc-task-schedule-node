import { getHour } from './../../utils/date';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportConfigurationProvider } from '../../providers/report-configuration/configuration.provider';

@Injectable()
export class ReportsService {
  constructor(
    private readonly providerConfiguration: ReportConfigurationProvider,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS, { name: 'generateReports' })
  async generateReportsMerchants() {
    const hour = getHour();
    const configs = await this.providerConfiguration.getConfigByNode(hour);
    console.log('Called when the current second is 10', configs);
  }
}
