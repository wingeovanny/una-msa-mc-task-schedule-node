import { LoggerModule } from '@deuna/node-logger-lib';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { KAFKA_CLIENT_CONFIG } from '../../config/kafka';
import { ReportsDbModule } from '../../db/reports/reports.module';
import { ReportConfigurationModule } from '../../providers/report-configuration/cofiguration.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ReportConfigurationModule,
    ReportsDbModule,
    LoggerModule.forRoot({ context: 'Transaction Module' }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
