import { IsArray, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';

export enum Type {
  Consolidate = 'CONSOLIDATE',
  Sales = 'SALES',
}
export enum Level {
  Branch = 'BRANCH',
  Unified = 'UNIFIED',
}

export class CreateReportsDto {
  @IsString()
  merchantId: string;

  @IsString()
  reportId: string;

  @IsString()
  @IsEnum(Type)
  type: Type;

  @IsString()
  @IsEnum(Level)
  level: Level;

  @IsDate()
  @IsOptional()
  lastSend: Date;

  @IsString()
  daysFrequency: string;

  @IsString()
  @IsOptional()
  cutOffDay?: string;

  @IsArray()
  @IsString({ each: true })
  cutOffTime: string[];

  @IsString()
  createdBy?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}

export class UpdateReportsDto {
  @IsString()
  daysFrequency: string;

  @IsString()
  @IsOptional()
  cutOffDay?: string;

  @IsArray()
  @IsString({ each: true })
  cutOffTime: string[];

  @IsDate()
  lastSend: Date;

  @IsString()
  updatedBy: string;
}
