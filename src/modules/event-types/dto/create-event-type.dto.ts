import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventTypeDto {
  @ApiProperty({ example: 'عيد ميلاد' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Birthday celebrations and parties', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

