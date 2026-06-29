import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Category name', example: 'Electronics' })
  @IsString()
  @IsOptional()
  name?: string;
}
