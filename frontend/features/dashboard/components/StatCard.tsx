import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Trend } from '@/services/admin/types';

interface StatCardProps {
  name: string;
  value: string;
  changePercent: number;
  trend: Trend;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({
  name,
  value,
  changePercent,
  trend,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-green-500'
      : trend === 'down'
        ? 'text-red-500'
        : 'text-muted-foreground';

  const TrendIcon =
    trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  const trendLabel =
    trend === 'up'
      ? `+${changePercent}%`
      : trend === 'down'
        ? `-${changePercent}%`
        : `${changePercent}%`;

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {name}
        </h3>
        <div className={`p-2 rounded-md ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${trendColor}`}>
        <TrendIcon size={14} />
        <span>{trendLabel} vs last month</span>
      </div>
    </div>
  );
}
