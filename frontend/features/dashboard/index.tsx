'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { CircleDollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useGetAnalyticsQuery } from '@/services/admin/adminApi';
import { Trend } from '@/services/admin/types';
import Skeleton from '@/components/skeleton/Skeleton';
import StatCard from './components/StatCard';
import RevenueChart from './components/RevenueChart';
import StatusDonut from './components/StatusDonut';
import RecentOrdersTable from './components/RecentOrdersTable';

const STAT_CONFIGS = [
  {
    key: 'totalRevenue' as const,
    name: 'TOTAL REVENUE',
    icon: CircleDollarSign,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-500/10',
    format: (v: number) => `$${v.toLocaleString()}`,
  },
  {
    key: 'totalOrders' as const,
    name: 'TOTAL ORDERS',
    icon: ShoppingCart,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    format: (v: number) => `${v}`,
  },
  {
    key: 'totalProducts' as const,
    name: 'PRODUCTS',
    icon: Package,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    format: (v: number) => `${v}`,
  },
  {
    key: 'avgOrderValue' as const,
    name: 'AVG ORDER VALUE',
    icon: TrendingUp,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/10',
    format: (v: number) => `$${v.toLocaleString()}`,
  },
];

export default function DashboardFeature() {
  const { data, isLoading, error } = useGetAnalyticsQuery();

  useEffect(() => {
    if (error) toast.error('Failed to load analytics data');
  }, [error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CONFIGS.map((cfg) => {
          const metric = data.stats[cfg.key];
          return (
            <StatCard
              key={cfg.key}
              name={cfg.name}
              value={cfg.format(metric.value)}
              changePercent={metric.changePercent}
              trend={metric.trend as Trend}
              icon={cfg.icon}
              iconColor={cfg.iconColor}
              iconBg={cfg.iconBg}
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <RevenueChart
          data={data.revenueChart}
          totalRevenue={data.stats.totalRevenue.value}
          revenueChange={data.stats.totalRevenue.changePercent}
          revenueTrend={data.stats.totalRevenue.trend}
        />
        <StatusDonut
          distribution={data.orderStatusDistribution}
          totalOrders={data.stats.totalOrders.value}
        />
      </div>

      <RecentOrdersTable orders={data.recentOrders} />
    </div>
  );
}
