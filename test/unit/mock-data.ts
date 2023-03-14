import { ReportControlSend } from '../../src/db/reports/report-control-send.entity';
import {
  CreateReportsDto,
  UpdateReportsDto,
} from '../../src/modules/reports/reports.dto';
import {
  Configurations,
  Level,
  Status,
  Type,
} from '../../src/providers/report-configuration/interfaces/configuration';

export const mockCreateReportControlDto: CreateReportsDto = {
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

export const mockReportCreateControlSend: ReportControlSend = {
  id: '8484accb-e717-4d80-8f48-55fa193bd193',
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

export const updateDto: UpdateReportsDto = {
  cutOffDay: '1',
  cutOffTime: ['09:00'],
  daysFrequency: '15',
  updatedBy: 'fernando',
  lastSend: new Date('2023-02-17 22:16:56.507623'),
};
export const idTestUuid = '4ac265d6-7a33-4ab2-a0b0-b31eaf63c5f8;';
export const mockCreateReportControl = {
  merchantId: '8484accb-e717-4d80-8f48-55fa193bd193',
  reportId: idTestUuid,
  type: Type.Consolidate,
  level: Level.Branch,
  lastSend: '2023-02-04T04:28:43.077Z',
  daysFrequency: '15',
  cutOffDay: '1',
  cutOffTime: ['09:00'],
  createBy: 'ebucayle',
  updatedBy: '',
  updateDate: '2023-02-04T04:28:43.077Z',
  createDate: '2023-02-04T04:28:43.077Z',
};

export const mockConfigurations: Configurations = {
  id: '123',
  name: 'SALES_1232345',
  type: Type.Consolidate,
  createdBy: 'ebucayle',
  updatedBy: '',
  merchantId: '8484accb-e717-4d80-8f48-55fa193bd193',
  daysFrequency: '7',
  level: Level.Branch,
  cutOffTime: ['10:00'],
  cutOffDay: '2',
  mails: [
    'correoquincenalunificado@gmail.com',
    'correoquicenalunificado12@gmail.com',
  ],
  status: Status.Active,
  createDate: new Date('2023-03-09T21:16:48.144Z'),
  updateDate: new Date('2023-03-09T21:16:48.144Z'),
};

export const mockResponseCreateReportControl = {
  id: idTestUuid,
  merchantId: '8484accb-e717-4d80-8f48-55fa193bd193',
  reportId: idTestUuid,
  type: Type.Consolidate,
  level: Level.Branch,
  lastSend: new Date('2023-03-09T21:16:48.144Z'),
  daysFrequency: '15',
  cutOffDay: '1',
  cutOffTime: ['09:00'],
  createBy: 'ebucayle',
  updatedBy: '',
  createdBy: '',
  updateDate: new Date('2023-03-09T21:16:48.144Z'),
  createDate: new Date('2023-03-09T21:16:48.144Z'),
};

export const mockResponseApiReports: Configurations[] = [
  {
    id: 'a3f5a212-8c90-48c1-925b-7cf7cdd94a40',
    name: 'SALES_1678378608072',
    type: Type.Consolidate,
    createdBy: 'ebucayle',
    updatedBy: 'ebucayle',
    merchantId: 'cd95b470-b75f-48d8-b3cc-768cc93a1c1f',
    daysFrequency: '15',
    level: Level.Branch,
    cutOffTime: ['12:00'],
    cutOffDay: '5',
    mails: [
      'correoquincenalunificado@gmail.com',
      'correoquicenalunificado12@gmail.com',
    ],
    status: Status.Active,
    updateDate: new Date('2023-03-09T21:16:48.144Z'),
    createDate: new Date('2023-03-09T21:16:48.144Z'),
  },
  {
    id: 'a3f5a212-8c90-48c1-925b-7cf7cdd94a40',
    name: 'SALES_1678378608072',
    type: Type.Consolidate,
    createdBy: 'ebucayle',
    updatedBy: 'ebucayle',
    merchantId: 'cd95b470-b75f-48d8-b3cc-768cc93a1c1f',
    daysFrequency: '15',
    level: Level.Branch,
    cutOffTime: ['12:00'],
    cutOffDay: '5',
    mails: [
      'correoquincenalunificado@gmail.com',
      'correoquicenalunificado12@gmail.com',
    ],
    status: Status.Active,
    updateDate: new Date('2023-03-09T21:16:48.144Z'),
    createDate: new Date('2023-03-09T21:16:48.144Z'),
  },
];

export const mockSuccessStatus = {
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};
export const mockSuccessResponseClient = {
  data: mockResponseApiReports,
  ...mockSuccessStatus,
};
