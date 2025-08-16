import { IsNumber, IsDateString, IsOptional, IsString, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  freelancerId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  packageId: number;

  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ example: 299.99 })
  @IsDecimal()
  totalAmount: number;

  @ApiProperty({ example: 40.7128, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -74.0060, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: '123 Main St, New York, NY', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Please arrive 30 minutes early', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
