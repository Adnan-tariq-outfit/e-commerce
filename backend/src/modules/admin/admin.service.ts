import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics() {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [revenueAll, revenueThisMonth, revenueLastMonth] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { totalAmount: true } }),
      this.prisma.order.aggregate({
        where: { createdAt: { gte: startOfThisMonth } },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
        _sum: { totalAmount: true },
      }),
    ]);

    const [ordersAll, ordersThisMonth, ordersLastMonth] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: startOfThisMonth } } }),
      this.prisma.order.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      }),
    ]);

    const [productsAll, productsThisMonth, productsLastMonth] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { createdAt: { gte: startOfThisMonth } } }),
      this.prisma.product.count({
        where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      }),
    ]);

    const totalRevValue = Number(revenueAll._sum.totalAmount ?? 0);
    const totalOrdValue = ordersAll;
    const totalProdValue = productsAll;
    const avgOrdValue = totalOrdValue > 0 ? totalRevValue / totalOrdValue : 0;

    const revThisM = Number(revenueThisMonth._sum.totalAmount ?? 0);
    const revLastM = Number(revenueLastMonth._sum.totalAmount ?? 0);
    const avgThisM = ordersThisMonth > 0 ? revThisM / ordersThisMonth : 0;
    const avgLastM = ordersLastMonth > 0 ? revLastM / ordersLastMonth : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const recentOrders30 = await this.prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { totalAmount: true, createdAt: true },
    });

    const revenueChart = Array.from({ length: 30 }, (_, i) => {
      const dayStart = new Date(thirtyDaysAgo);
      dayStart.setDate(dayStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const amount = recentOrders30
        .filter((o) => o.createdAt >= dayStart && o.createdAt < dayEnd)
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);

      return { day: i + 1, amount };
    });

    const statusGroups = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const allStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const orderStatusDistribution: Record<string, number> = {};
    allStatuses.forEach((s) => { orderStatusDistribution[s] = 0; });
    statusGroups.forEach((g) => { orderStatusDistribution[g.status] = g._count.id; });

    const recent = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    const recentOrders = recent.map((o) => ({
      id: o.id,
      displayId: `ORD-${o.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`,
      customer: { name: o.user.name, email: o.user.email },
      createdAt: o.createdAt.toISOString(),
      status: o.status,
      totalAmount: Number(o.totalAmount),
    }));

    return {
      stats: {
        totalRevenue: this.buildMetric(Math.round(totalRevValue), revThisM, revLastM),
        totalOrders: this.buildMetric(totalOrdValue, ordersThisMonth, ordersLastMonth),
        totalProducts: this.buildMetric(totalProdValue, productsThisMonth, productsLastMonth),
        avgOrderValue: this.buildMetric(Math.round(avgOrdValue), avgThisM, avgLastM),
      },
      revenueChart,
      orderStatusDistribution,
      recentOrders,
    };
  }

  private buildMetric(value: number, thisMonth: number, lastMonth: number) {
    if (lastMonth === 0) {
      return { value, changePercent: 0, trend: 'neutral' as const };
    }
    const raw = ((thisMonth - lastMonth) / lastMonth) * 100;
    const changePercent = Math.round(Math.abs(raw) * 10) / 10;
    const trend = raw > 0 ? ('up' as const) : raw < 0 ? ('down' as const) : ('neutral' as const);
    return { value, changePercent, trend };
  }
}
