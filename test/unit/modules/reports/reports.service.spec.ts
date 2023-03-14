import { getHour } from './../../../../src/utils/date';
import { Logger } from '@deuna/node-logger-lib';
import { Test, TestingModule } from '@nestjs/testing';
import {
  KAFKA_NAME,
  SEND_MAIL_REPORT_MERCHANT,
} from '../../../../src/constants/common';
import { ReportsDbService } from '../../../../src/db/reports/reports.service';
import { ReportsService } from '../../../../src/modules/reports/reports.service';
import { ReportConfigurationProvider } from '../../../../src/providers/report-configuration/configuration.provider';
import { FREQUENCY_STRATEGIES } from '../../../../src/utils/strategy/strategies-object';
import {
  mockConfigurations,
  mockCreateReportControl,
  mockCreateReportControlDto,
  mockReportCreateControlSend,
  mockResponseApiReports,
  mockResponseCreateReportControl,
} from '../../mock-data';

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
            getConfigReportByHour: jest.fn(() => {
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

  describe('generateReportsMerchants', () => {
    it('should not call the recordSendMailKafka or registerSendMailDbControl methods if no emails should be sent', async () => {
      const getReportsConfigMock = jest
        .spyOn(service, 'getReportsConfig')
        .mockResolvedValue(mockResponseApiReports);

      const getDataFromControlSendMock = jest
        .spyOn(service, 'getDataFromControlSend')
        .mockResolvedValue(mockReportCreateControlSend);

      const shouldSendEmailMock = jest
        .spyOn(service, 'shouldSendEmail')
        .mockResolvedValue(false);

      const recordSendMailKafkaMock = jest.spyOn(
        service,
        'recordSendMailKafka',
      );

      const registerSendMailDbControlMock = jest.spyOn(
        service,
        'registerSendMailDbControl',
      );

      await service.generateReportsMerchants();

      expect(getReportsConfigMock).toHaveBeenCalledTimes(1);
      expect(getDataFromControlSendMock).toHaveBeenCalledTimes(
        mockResponseApiReports.length,
      );
      expect(shouldSendEmailMock).toHaveBeenCalledTimes(
        mockResponseApiReports.length,
      );
      expect(recordSendMailKafkaMock).not.toHaveBeenCalled();
      expect(registerSendMailDbControlMock).not.toHaveBeenCalled();
    });

    it('should call the recordSendMailKafka and registerSendMailDbControl methods if emails should be sent', async () => {
      const getReportsConfigMock = jest
        .spyOn(service, 'getReportsConfig')
        .mockResolvedValue(mockResponseApiReports);
      const getDataFromControlSendMock = jest
        .spyOn(service, 'getDataFromControlSend')
        .mockResolvedValue(mockResponseCreateReportControl);

      const shouldSendEmailMock = jest
        .spyOn(service, 'shouldSendEmail')
        .mockResolvedValue(true);

      const recordSendMailKafkaMock = jest.spyOn(
        service,
        'recordSendMailKafka',
      );

      const registerSendMailDbControlMock = jest.spyOn(
        service,
        'registerSendMailDbControl',
      );

      await service.generateReportsMerchants();

      expect(getReportsConfigMock).toHaveBeenCalledTimes(1);
      expect(getDataFromControlSendMock).toHaveBeenCalledTimes(
        mockResponseApiReports.length,
      );
      expect(shouldSendEmailMock).toHaveBeenCalledTimes(
        mockResponseApiReports.length,
      );
      expect(recordSendMailKafkaMock).toHaveBeenCalledTimes(
        mockResponseApiReports.length,
      );
      expect(registerSendMailDbControlMock).toHaveBeenCalledTimes(
        mockResponseApiReports.length,
      );
    });
  });
  describe('getReportsConfig', () => {
    it('should return data of confgis reports from provider reports', async () => {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = '00';
      const hour = `${hours}:${minutes}`;
      jest
        .spyOn(providerConfig, 'getConfigReportByHour')
        .mockResolvedValueOnce(mockResponseApiReports);

      const result = await service.getReportsConfig();
      expect(providerConfig.getConfigReportByHour).toBeCalledTimes(1);
      expect(providerConfig.getConfigReportByHour).toHaveBeenCalledWith(hour);
      expect(result).toEqual(mockResponseApiReports);
    });
  });

  describe('getDataFromControlSend', () => {
    it('should return data of confgis reports from data base', async () => {
      const id = '12';
      const result = await service.getDataFromControlSend(id);

      expect(dbService.findOne).toBeCalledWith(id);
      expect(dbService.findOne).toBeCalledTimes(1);
      expect(dbService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponseCreateReportControl);
    });
  });

  describe('shouldSendEmail', () => {
    it('should call shouldSendEmailConfig with the correct parameters when localReport is undefined', async () => {
      const expectedFrequency = '7';
      const expectedCutOffDay = 2;
      const shouldSendEmailConfigMock = jest.spyOn(
        service,
        'shouldSendEmailConfig',
      );

      await service.shouldSendEmail(mockConfigurations, undefined);

      expect(shouldSendEmailConfigMock).toHaveBeenCalledWith(
        expectedFrequency,
        expectedCutOffDay,
      );
    });

    it('should call shouldSendEmailConfig with the correct parameters when localReport is defined', async () => {
      const expectedFrequency = '7';
      const expectedCutOffDay = 2;
      const expectedLastSentDate = new Date('2023-02-04T04:28:43.077Z');
      const shouldSendEmailConfigMock = jest.spyOn(
        service,
        'shouldSendEmailConfig',
      );

      await service.shouldSendEmail(
        mockConfigurations,
        mockReportCreateControlSend,
      );

      expect(shouldSendEmailConfigMock).toHaveBeenCalledWith(
        expectedFrequency,
        expectedCutOffDay,
        expectedLastSentDate,
      );
    });

    it('should return the value returned by shouldSendEmailConfig', async () => {
      const expectedValue = true;
      jest
        .spyOn(service, 'shouldSendEmailConfig')
        .mockImplementationOnce(() => true);
      //shouldSendEmailConfigMock.mockResolvedValue(expectedValue);

      const result = await service.shouldSendEmail(
        mockConfigurations,
        undefined,
      );

      expect(result).toBe(expectedValue);
    });
  });

  it('should publish to the SEND_MAIL_REPORT_MERCHANT topic', async () => {
    await service.recordSendMailKafka(mockConfigurations);

    // expect(mockEmit).toHaveBeenCalledTimes(1);
    expect(mockEmit).toHaveBeenCalledWith({
      topic: SEND_MAIL_REPORT_MERCHANT,
      value: { configMail: mockConfigurations },
      headers: {
        source: '@lxba/bo-mc-task-schedule',
        timestamp: expect.any(String),
      },
    });
  });

  describe('registerSendMailDbControl', () => {
    it('should call updateReportsDbControl when localReport is defined', async () => {
      jest
        .spyOn(service, 'updateReportsDbControl')
        .mockImplementation(() => Promise.resolve());

      jest
        .spyOn(service, 'createReportsDbControl')
        .mockImplementation(() => Promise.resolve());

      service.registerSendMailDbControl(
        mockConfigurations,
        mockReportCreateControlSend,
      );

      expect(service.updateReportsDbControl).toHaveBeenCalledWith(
        mockReportCreateControlSend.id,
        mockConfigurations,
      );
    });

    it('should call createReportsDbControl when localReport is undefined', async () => {
      // Arrange
      const localReport = undefined;
      jest
        .spyOn(service, 'updateReportsDbControl')
        .mockImplementation(() => Promise.resolve());

      jest
        .spyOn(service, 'createReportsDbControl')
        .mockImplementation(() => Promise.resolve());

      service.registerSendMailDbControl(mockConfigurations, localReport);

      expect(service.createReportsDbControl).toHaveBeenCalledWith(
        mockConfigurations,
      );
    });
  });

  describe('createReportsDbControl', () => {
    it('should create a new report with the correct data', async () => {
      jest
        .spyOn(service, 'buildCreateReportsDto')
        .mockReturnValue(mockCreateReportControlDto);
      jest
        .spyOn(dbService, 'create')
        .mockResolvedValue(mockResponseCreateReportControl);

      await service.createReportsDbControl(mockConfigurations);

      expect(service.buildCreateReportsDto).toHaveBeenCalledWith(
        mockConfigurations,
      );
      expect(dbService.create).toHaveBeenCalledWith(mockCreateReportControlDto);
    });
  });

  describe('reportCreate', () => {
    it('should return a CreateReportsDto object with the correct values', () => {
      const result = service.buildCreateReportsDto(mockConfigurations);

      expect(result).toEqual({
        merchantId: mockConfigurations.merchantId,
        reportId: mockConfigurations.id,
        type: mockConfigurations.type,
        level: mockConfigurations.level,
        lastSend: expect.any(Date),
        daysFrequency: mockConfigurations.daysFrequency,
        cutOffDay: mockConfigurations.cutOffDay,
        cutOffTime: mockConfigurations.cutOffTime,
        createdBy: mockConfigurations.createdBy,
      });
    });
  });

  describe('updateReportsDbControl', () => {
    const mockId = '1234';

    it('should call dbService.update with the correct arguments', async () => {
      const dbServiceUpdateSpy = jest.spyOn(dbService, 'update');

      await service.updateReportsDbControl(mockId, mockConfigurations);

      expect(dbServiceUpdateSpy).toHaveBeenCalledWith(mockId, {
        daysFrequency: mockConfigurations.daysFrequency,
        cutOffDay: mockConfigurations.cutOffDay,
        cutOffTime: mockConfigurations.cutOffTime,
        lastSend: expect.any(Date),
        updatedBy: 'jobsReports',
      });
    });
  });
  describe('shouldSendEmailConfig', () => {
    const yesterday = new Date('2023-03-12T00:00:00.000Z');

    const mockFrequencyStrategy = {
      name: '1',
      shouldSendEmail: jest.fn(),
    };

    beforeAll(() => {
      // Mock the FREQUENCY_STRATEGIES array to return a mock strategy for testing
      Object.defineProperty(FREQUENCY_STRATEGIES, 'find', {
        value: jest.fn(() => mockFrequencyStrategy),
      });
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call shouldSendEmail method of the strategy with the correct parameters', () => {
      const cutOffDay = 3;
      const lastSentDate = yesterday;

      service.shouldSendEmailConfig(
        mockFrequencyStrategy.name,
        cutOffDay,
        lastSentDate,
      );

      expect(mockFrequencyStrategy.shouldSendEmail).toHaveBeenCalledTimes(1);
    });

    it('should return the value returned by shouldSendEmail method of the strategy', () => {
      const expectedResult = true;

      mockFrequencyStrategy.shouldSendEmail.mockReturnValue(expectedResult);

      const result = service.shouldSendEmailConfig(
        mockFrequencyStrategy.name,
        1,
      );

      expect(result).toBe(expectedResult);
    });
  });
});
