import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum RoleDto {
  CLIENT = 'CLIENT',
  MASTER = 'MASTER',
}

export class UpdateRoleDto {
  @IsEnum(RoleDto)
  role: RoleDto;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
