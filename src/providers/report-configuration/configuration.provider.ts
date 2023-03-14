import { Configurations } from './interfaces/configuration';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { endpoints } from './constants/api';

@Injectable()
export class ReportConfigurationProvider {
  constructor(private httpService: HttpService) {}
  async getConfigReportByHour(hour: string): Promise<Configurations[]> {
    const { data: response } = await lastValueFrom(
      this.httpService.get(
        `${process.env.bo_mc_report_service}${endpoints.REPORTS}configs/${hour}`,
        {},
      ),
    );
    return response;
  }
}
