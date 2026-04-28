import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(2)
  firstName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  phone?: string;
}
