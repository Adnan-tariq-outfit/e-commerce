import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (default: 1)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page (default: 10)' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'earbuds', description: 'Search by product name' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category', description: 'Filter by category id' })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
