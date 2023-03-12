import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportConfigurationModule } from '../../providers/report-configuration/cofiguration.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [ScheduleModule.forRoot(), ReportConfigurationModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
