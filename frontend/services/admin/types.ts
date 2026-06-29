export type Trend = 'up' | 'down' | 'neutral';

export interface StatMetric {
  value: number;
  changePercent: number;
  trend: Trend;
}

export interface RevenueChartItem {
  day: number;
  amount: number;
}

export interface RecentOrder {
  id: string;
  displayId: string;
  customer: { name: string; email: string };
  createdAt: string;
  status: string;
  totalAmount: number;
}

export type OrderStatusKey = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface AnalyticsResponse {
  stats: {
    totalRevenue: StatMetric;
    totalOrders: StatMetric;
    totalProducts: StatMetric;
    avgOrderValue: StatMetric;
  };
  revenueChart: RevenueChartItem[];
  orderStatusDistribution: Record<OrderStatusKey, number>;
  recentOrders: RecentOrder[];
}
