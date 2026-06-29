'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RevenueChartItem, Trend } from '@/services/admin/types';

interface RevenueChartProps {
  data: RevenueChartItem[];
  totalRevenue: number;
  revenueChange: number;
  revenueTrend: Trend;
}

const formatYAxis = (value: number) => {
  if (value === 0) return '$0';
  return `$${(value / 1000).toFixed(1)}k`;
};

export default function RevenueChart({
  data,
  totalRevenue,
  revenueChange,
  revenueTrend,
}: RevenueChartProps) {
  const changeColor =
    revenueTrend === 'up'
      ? 'text-green-500'
      : revenueTrend === 'down'
        ? 'text-red-500'
        : 'text-muted-foreground';

  const changePrefix = revenueTrend === 'up' ? '+' : revenueTrend === 'down' ? '-' : '';

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-semibold text-base">Revenue Overview</h2>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">${totalRevenue.toLocaleString()}</p>
          <p className={`text-xs font-medium ${changeColor}`}>
            {changePrefix}{revenueChange}% MoM
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(128,128,128,0.15)"
          />
          <XAxis
            dataKey="day"
            ticks={[1, 8, 15, 22, 30]}
            tickFormatter={(v) => `Day ${v}`}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            width={55}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
            labelFormatter={(label) => `Day ${label}`}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
