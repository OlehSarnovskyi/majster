import { IsString, IsNumber, Min, MinLength, IsUUID, IsOptional } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(15)
  @IsOptional()
  durationMinutes?: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
