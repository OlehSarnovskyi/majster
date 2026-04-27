import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\+?[0-9\s\-]{7,15}$/, { message: 'Invalid phone number format' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(1000)
  bio?: string;
}
