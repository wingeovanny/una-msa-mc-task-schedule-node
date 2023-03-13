import { Module } from '@nestjs/common';
import { LoggerModule } from '@deuna/node-logger-lib';
import { DatabaseService } from '@deuna/node-database-lib';
import { ReportsDbService } from './reports.service';
import { Repository } from 'typeorm';

@Module({
  imports: [LoggerModule.forRoot({ context: 'Transaction Database Service' })],
  exports: [ReportsDbService],
  providers: [ReportsDbService, DatabaseService, Repository],
})
export class ReportsDbModule {}
