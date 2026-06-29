'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { OrderStatusKey } from '@/services/admin/types';

const STATUS_COLORS: Record<OrderStatusKey, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#8b5cf6',
  SHIPPED: '#60a5fa',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
};

const STATUS_LABELS: Record<OrderStatusKey, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const STATUS_ORDER: OrderStatusKey[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

interface StatusDonutProps {
  distribution: Record<OrderStatusKey, number>;
  totalOrders: number;
}

export default function StatusDonut({ distribution, totalOrders }: StatusDonutProps) {
  const data = STATUS_ORDER.map((status) => ({
    status,
    count: distribution[status] ?? 0,
    color: STATUS_COLORS[status],
    label: STATUS_LABELS[status],
  }));

  const hasData = data.some((d) => d.count > 0);

  const pieData = hasData
    ? data.filter((d) => d.count > 0).map((d) => ({ ...d, value: d.count }))
    : [{ status: 'NONE', count: 0, color: '#e5e7eb', label: 'No orders', value: 1 }];

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
      <h2 className="font-semibold text-base mb-0.5">Order Status</h2>
      <p className="text-sm text-muted-foreground mb-4">Distribution</p>

      <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(var(--card))"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold">{totalOrders}</span>
          <span className="text-xs text-muted-foreground">orders</span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLORS[status] }}
              />
              <span className="text-muted-foreground">{STATUS_LABELS[status]}</span>
            </div>
            <span className="font-medium tabular-nums">{distribution[status] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
