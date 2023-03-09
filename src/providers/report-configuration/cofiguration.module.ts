import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@deuna/node-logger-lib';
import { ReportConfigurationProvider } from './configuration.provider';

@Module({
  imports: [
    HttpModule,
    LoggerModule.forRoot({ context: 'ReportConfig Provider' }),
  ],
  exports: [ReportConfigurationProvider],
  providers: [ReportConfigurationProvider],
})
export class ReportConfigurationModule {}
