import { CreateReportsDto } from './../../../src/modules/reports/reports.dto';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '@deuna/node-database-lib';

import { Repository } from 'typeorm';
import { ReportsDbService } from '../../../src/db/reports/reports.service';
import {
  Type,
  Level,
  UpdateReportsDto,
} from '../../../src/modules/reports/reports.dto';
import {
  mockCreateReportControl,
  mockResponseCreateReportControl,
} from '../modules/reports/mock-data';

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');
export const idTestUuid = '4ac265d6-7a33-4ab2-a0b0-b31eaf63c5f8;';
describe('Reporter DB service', () => {
  let serviceDb: ReportsDbService;
  let dbRepository: DatabaseService;

  const mockCreateReportControlDto: CreateReportsDto = {
    merchantId: '8484accb-e717-4d80-8f48-55fa193bd193',
    reportId: '8484accb-e717-4d80-8f48-55fa193bd193',
    type: Type.Sales,
    level: Level.Unified,
    lastSend: new Date('2023-02-04T04:28:43.077Z'),
    daysFrequency: '15',
    cutOffDay: '1',
    cutOffTime: ['09:00'],
    createdBy: 'ebucayle',
    updatedBy: '',
  };

  const updateDto: UpdateReportsDto = {
    cutOffDay: '1',
    cutOffTime: ['09:00'],
    daysFrequency: '15',
    updatedBy: 'fernando',
    lastSend: new Date('2023-02-17 22:16:56.507623'),
  };

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
