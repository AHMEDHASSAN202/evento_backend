import { IsString, IsArray, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType, Gender } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format (e.g., +1234567890)',
  })
  phone: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ enum: UserType, example: UserType.USER })
  @IsEnum(UserType)
  type: UserType;

  @ApiProperty({ enum: Gender, example: Gender.MALE, description: 'Gender is required for all users' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'Professional photographer with 10+ years experience', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'https://portfolio.com', required: false })
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray()
  cityIds: number[];
}
