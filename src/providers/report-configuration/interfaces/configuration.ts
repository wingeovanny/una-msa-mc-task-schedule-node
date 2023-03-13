export interface Configurations {
  id: string;
  name: string;
  type: Type;
  createdBy: string;
  updatedBy: string;
  merchantId: string;
  daysFrequency: string;
  level: Level;
  cutOffTime: string[];
  cutOffDay: null | string;
  mails: string[];
  status: Status;
  createDate: Date;
  updateDate: Date;
}

export enum Level {
  Branch = 'BRANCH',
  Unified = 'UNIFIED',
}

export enum Status {
  Active = 'ACTIVE',
}

export enum Type {
  Consolidate = 'CONSOLIDATE',
  Sales = 'SALES',
}
