import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Pro Earbuds' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  categoryId: string;

  @ApiProperty({ example: 'High-quality wireless earbuds with noise cancellation.' })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({ example: 189.99 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 249.99 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQty?: number;

  @ApiPropertyOptional({ type: [String], example: ['new', 'bestseller'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
