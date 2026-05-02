import { IsUUID, IsDateString, IsOptional, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsDateString()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Adresa musí mať aspoň 5 znakov' })
  @MaxLength(300)
  address: string;

  @IsString()
  @IsOptional()
  note?: string;
}
