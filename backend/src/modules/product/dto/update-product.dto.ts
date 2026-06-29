import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Wireless Pro Earbuds' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'High-quality wireless earbuds.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 189.99 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 249.99 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({ example: 10 })
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

  @ApiPropertyOptional({
    type: [String],
    description: 'Filenames of images to remove from this product (e.g. "1234567-image.jpg")',
    example: ['1234567-image.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  removeImages?: string[];
}
