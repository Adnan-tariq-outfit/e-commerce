import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  getCart(@GetUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiResponse({ status: 200, description: 'Item added; full cart returned' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  addToCart(
    @GetUser('id') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update quantity of a cart item (0 = remove)' })
  @ApiResponse({ status: 200, description: 'Item updated; full cart returned' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  updateCartItem(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(userId, itemId, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove a specific item from the cart' })
  @ApiResponse({ status: 200, description: 'Item removed; full cart returned' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  removeCartItem(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeCartItem(userId, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear all items from the cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared; empty cart returned' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  clearCart(@GetUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
