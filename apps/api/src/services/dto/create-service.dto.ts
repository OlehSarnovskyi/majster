import { IsString, IsNumber, Min, MinLength, IsUUID } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(15)
  durationMinutes: number;

  @IsUUID()
  categoryId: string;
}
