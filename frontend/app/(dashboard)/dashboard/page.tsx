import { CircleDollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      name: 'Total Revenue',
      value: '$93,740',
      change: '+22.5%',
      trend: 'up',
      icon: CircleDollarSign,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10'
    },
    {
      name: 'Total Orders',
      value: '8',
      change: '+8.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      name: 'Products',
      value: '8',
      change: '0%',
      trend: 'neutral',
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      name: 'Avg Order Value',
      value: '$382',
      change: '+5.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-xl border border-border/40 bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.name}</h3>
                <div className={`p-2 rounded-md ${stat.bg}`}>
                  <Icon size={18} className={stat.color} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stat.value}</div>
              </div>
              <div className={`text-xs mt-2 font-medium ${
                stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {stat.change} vs last month
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Chart placeholder</p>
      </div>
    </div>
  );
}
