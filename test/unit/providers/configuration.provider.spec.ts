import { ReportConfigurationProvider } from './../../../src/providers/report-configuration/configuration.provider';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { MaybeMockedDeep } from 'ts-jest/dist/utils/testing';
import { of } from 'rxjs';
import {
  mockResponseApiReports,
  mockSuccessResponseClient,
} from '../mock-data';
import { endpoints } from '../../../src/providers/report-configuration/constants/api';

describe('ReportConfiguration Provider', () => {
  let provider: ReportConfigurationProvider;
  let spyHttpService: MaybeMockedDeep<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportConfigurationProvider,
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(),
            get: jest.fn(),
          }),
        },
      ],
    }).compile();
    spyHttpService = module.get(HttpService);
    provider = module.get<ReportConfigurationProvider>(
      ReportConfigurationProvider,
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getConfigReportByHour', () => {
    afterEach(() => {
      spyHttpService.get.mockClear();
    });

    it('should return a client object if the request is successful', async () => {
      spyHttpService.get.mockImplementationOnce(() =>
        of(mockSuccessResponseClient),
      );
      const hour = '12:00';
      const result = await provider.getConfigReportByHour(hour);
      expect(spyHttpService.get).toHaveBeenCalledTimes(1);
      expect(spyHttpService.get).toHaveBeenCalledWith(
        `${process.env.bo_mc_report_service}${endpoints.REPORTS}configs/${hour}`,
        {},
      );
      expect(result).toEqual(mockResponseApiReports);
    });
  });
});
