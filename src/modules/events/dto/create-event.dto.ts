import { IsString, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Birthday Party for Sarah' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A beautiful birthday celebration with decorations and cake', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  eventTypeId: number;
}

