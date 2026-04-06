import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(0)
  @Max(100000)
  price: number;

  @IsInt()
  @Min(15)
  @Max(480)
  durationMinutes: number;

  @IsUUID()
  categoryId: string;
}
