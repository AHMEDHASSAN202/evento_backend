import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ example: 'New York' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'The Big Apple', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

