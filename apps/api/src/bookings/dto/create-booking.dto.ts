import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsDateString()
  startTime: string;

  @IsString()
  @IsOptional()
  note?: string;
}
