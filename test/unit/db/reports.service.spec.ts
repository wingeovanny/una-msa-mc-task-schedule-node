import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '@deuna/node-database-lib';
import { Repository } from 'typeorm';
import { ReportsDbService } from '../../../src/db/reports/reports.service';
import {
  mockCreateReportControl,
  mockCreateReportControlDto,
  mockResponseCreateReportControl,
  updateDto,
} from '../mock-data';
import { ReportControlSend } from '../../../src/db/reports/report-control-send.entity';

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
export const idTestUuid = '4ac265d6-7a33-4ab2-a0b0-b31eaf63c5f8;';
describe('Reporter DB service', () => {
  let serviceDb: ReportsDbService;
  let dbRepository: DatabaseService;

  const mockSave = jest.fn(() => Promise.resolve(mockCreateReportControl));
  const mockFindOne = jest.fn(() =>
    Promise.resolve(mockResponseCreateReportControl),
  );
  const mockUpdate = jest.fn(() => Promise.resolve({ affected: 1 }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsDbService,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              findOne: mockFindOne,
              update: mockUpdate,
            })),
            isDbConnectionAlive: jest.fn(() => Promise.resolve(true)),
          }),
        },
        {
          provide: Repository,
          useFactory: () => ({
            save: mockSave,
            findOne: mockFindOne,
            update: mockUpdate,
            create: mockUpdate,
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
            })),
            isDbConnectionAlive: jest.fn(() => Promise.resolve(true)),
          }),
        },
      ],
    }).compile();
    serviceDb = module.get<ReportsDbService>(ReportsDbService);
    dbRepository = module.get(DatabaseService);
    // serviceDb.onModuleInit();
  });
  it('should be defined', () => {
    expect(serviceDb).toBeDefined();
    expect(dbRepository).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize the database connection and set the repository', async () => {
      await serviceDb.onModuleInit();
      // expect(dbRepository.init).toHaveBeenCalledWith(config);
      expect(dbRepository.getRepository).toHaveBeenCalledWith(
        ReportControlSend,
      );
    });

    it('should refresh the database connection and set the repository if DB_ROTATING_KEY is true', async () => {
      process.env.DB_ROTATING_KEY = 'true';
      process.env.DB_CONNECTION_REFRESH_MINUTES = '1';
      await serviceDb.onModuleInit();
      // expect(dbRepository.init).toHaveBeenCalledWith(config);
      expect(dbRepository.getRepository).toHaveBeenCalledWith(
        ReportControlSend,
      );
      jest.advanceTimersByTime(60 * 1000);
    });
  });
  describe('Create a new record and return', () => {
    beforeAll(() => {
      serviceDb.onModuleInit();
    });
    it('Should call the correct function with return the correct data', async () => {
      const record = await serviceDb.create(mockCreateReportControlDto);
      expect(record).toEqual(mockCreateReportControl);
    });
  });

  describe('Find a item by id', () => {
    beforeAll(() => {
      serviceDb.onModuleInit();
    });
    it('Should return a specific Report data with a ID', async () => {
      const record = await serviceDb.findOne(idTestUuid);
      expect(mockFindOne).toHaveBeenCalledWith({
        reportId: idTestUuid,
      });
      expect(record).toEqual(mockResponseCreateReportControl);
    });
  });

  describe('Update a item by id', () => {
    beforeAll(() => {
      serviceDb.onModuleInit();
    });
    it('Should return affected 1 by updated', async () => {
      await serviceDb.update(idTestUuid, updateDto);
      expect(mockUpdate).toHaveBeenCalledWith(
        {
          id: idTestUuid,
        },
        updateDto,
      );
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('isDbConnectionAlive', () => {
    beforeAll(() => {
      serviceDb.onModuleInit();
    });
    afterEach(() => {
      mockFindOne.mockClear();
    });

    it('given need validate connection to database when call method then isDbConnectionAlive then return databases is true', async () => {
      const result = await serviceDb.isDbConnectionAlive();
      expect(result).toEqual(true);
    });
  });
});
