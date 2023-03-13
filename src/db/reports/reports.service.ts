import { DatabaseService } from '@deuna/node-database-lib';
import { Repository, UpdateResult } from 'typeorm';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from '../../config/connection.orm.config';

import { ReportControlSend } from './report-control-send.entity';
import {
  CreateReportsDto,
  UpdateReportsDto,
} from '../../modules/reports/reports.dto';

@Injectable()
export class ReportsDbService implements OnModuleInit {
  constructor(
    private dbService: DatabaseService,
    private repository: Repository<ReportControlSend>,
  ) {}

  async onModuleInit() {
    await this.dbService.init(await config);
    this.repository = this.dbService.getRepository(ReportControlSend);
    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(await config);
        this.repository = this.dbService.getRepository(ReportControlSend);
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async create(data: CreateReportsDto): Promise<ReportControlSend> {
    return this.repository.save(data);
  }

  async findOne(reportId: string): Promise<ReportControlSend> {
    return this.repository.findOne({
      reportId,
    });
  }

  async update(id: string, data: UpdateReportsDto): Promise<UpdateResult> {
    return this.repository.update({ id }, data);
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    return this.dbService.isDbConnectionAlive();
  }
}
