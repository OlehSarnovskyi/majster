import { IsEnum, IsOptional, IsString, MaxLength, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum RoleDto {
  CLIENT = 'CLIENT',
  MASTER = 'MASTER',
}

export class DayScheduleDto {
  @IsBoolean()
  enabled: boolean;

  @IsString()
  from: string; // "08:00"

  @IsString()
  to: string;   // "18:00"
}

export class WorkingHoursDto {
  @ValidateNested()
  @Type(() => DayScheduleDto)
  mon: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  tue: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  wed: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  thu: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  fri: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
  sat: DayScheduleDto;

  @ValidateNested()
  @Type(() => DayScheduleDto)
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
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto;
}
