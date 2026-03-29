import { IsEnum } from 'class-validator';

export enum RoleDto {
  CLIENT = 'CLIENT',
  MASTER = 'MASTER',
}

export class UpdateRoleDto {
  @IsEnum(RoleDto)
  role: RoleDto;
}
