import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'Product UUID to add to cart' })
  @IsUUID()
  productId: string;

  @ApiProperty({ minimum: 1, description: 'Quantity to add' })
  @IsInt()
  @Min(1)
  quantity: number;
}
