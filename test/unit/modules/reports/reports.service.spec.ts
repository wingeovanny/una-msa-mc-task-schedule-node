import { Logger } from '@deuna/node-logger-lib';
import { Test, TestingModule } from '@nestjs/testing';
import { KAFKA_NAME } from '../../../../src/constants/common';
import { ReportsDbService } from '../../../../src/db/reports/reports.service';
import { ReportsService } from '../../../../src/modules/reports/reports.service';
import { ReportConfigurationProvider } from '../../../../src/providers/report-configuration/configuration.provider';
import {
  mockCreateReportControl,
  mockResponseApiReports,
  mockResponseCreateReportControl,
} from './mock-data';

describe('ReportsService', () => {
  let service: ReportsService;
  let dbService: ReportsDbService;
  let providerConfig: ReportConfigurationProvider;
  let logger: Logger;
  const mockEmit = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: KAFKA_NAME,
          useFactory: () => {
            emit: mockEmit;
          },
        },
        {
          provide: ReportConfigurationProvider,
          useFactory: () => ({
            getClientByRuc: jest.fn(() => {
              Promise.resolve(mockResponseApiReports);
            }),
          }),
        },
        {
          provide: ReportsDbService,
          useFactory: () => ({
            create: jest.fn(() => Promise.resolve(mockCreateReportControl)),
            findOne: jest.fn(() =>
              Promise.resolve(mockResponseCreateReportControl),
            ),
            update: jest.fn(() => Promise.resolve({ affected: 1 })),
            deleteOne: jest.fn(() => Promise.resolve({ affected: 1 })),
          }),
        },
        {
          provide: Logger,
          useFactory: () => ({
            log: jest.fn(),
            debug: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    providerConfig = module.get(ReportConfigurationProvider);
    dbService = module.get(ReportsDbService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(providerConfig).toBeDefined();
    expect(dbService).toBeDefined();
    expect(logger).toBeDefined();
  });
});
