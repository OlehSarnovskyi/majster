import { IsEnum, IsOptional, IsString, MaxLength, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum RoleDto {
  CLIENT = 'CLIENT',
  MASTER = 'MASTER',
}

export class DayScheduleDto {
  enabled: boolean;
  from: string; // "08:00"
  to: string;   // "18:00"
}

export class WorkingHoursDto {
  mon: DayScheduleDto;
  tue: DayScheduleDto;
  wed: DayScheduleDto;
  thu: DayScheduleDto;
  fri: DayScheduleDto;
  sat: DayScheduleDto;
  sun: DayScheduleDto;
}

export class UpdateRoleDto {
  @IsEnum(RoleDto)
  role: RoleDto;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsObject()
  workingHours?: WorkingHoursDto;
}
