import { IsUUID, IsDateString, IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsDateString()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  address: string;

  @IsString()
  @IsOptional()
  note?: string;
}
