export class StatMetricDto {
  value: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export class StatsDto {
  totalRevenue: StatMetricDto;
  totalOrders: StatMetricDto;
  totalProducts: StatMetricDto;
  avgOrderValue: StatMetricDto;
}

export class RevenueChartItemDto {
  day: number;
  amount: number;
}

export class RecentOrderCustomerDto {
  name: string;
  email: string;
}

export class RecentOrderDto {
  id: string;
  displayId: string;
  customer: RecentOrderCustomerDto;
  createdAt: string;
  status: string;
  totalAmount: number;
}

export class AnalyticsResponseDto {
  stats: StatsDto;
  revenueChart: RevenueChartItemDto[];
  orderStatusDistribution: Record<string, number>;
  recentOrders: RecentOrderDto[];
}
