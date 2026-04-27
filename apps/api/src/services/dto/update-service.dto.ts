import { IsString, IsNumber, Min, MinLength, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(15)
  durationMinutes?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
