import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersQueryDto } from './dto/list-orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findFirst({
        where: { userId },
        include: { items: { include: { product: true } } },
      });

      if (!cart || cart.items.length === 0) {
        throw new NotFoundException('Cart is empty');
      }

      for (const item of cart.items) {
        if (item.product.stockQty < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${item.product.name}`,
          );
        }
      }

      const totalAmount = cart.items.reduce(
        (sum, item) =>
          sum + Number(item.product.price) * item.quantity,
        0,
      );

      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress: dto.shippingAddress,
          status: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQty: { decrement: item.quantity } },
        });
      }

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          provider: 'mock',
          status: 'COMPLETED',
          transactionId: randomUUID(),
        },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { ...order, payment };
    });
  }

  async listMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });
  }

  async getMyOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async listAllOrders(query: ListOrdersQueryDto) {
    const { page = 1, limit = 20, status } = query;
    const where = status ? { status } : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: true } },
          payment: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a terminal order status');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });
  }
}
