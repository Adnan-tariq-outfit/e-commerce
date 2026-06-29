import DashboardFeature from '@/features/dashboard';

export const metadata = {
  title: 'Dashboard — Admin',
  description: 'Overview of your store performance',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Overview of your store performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>

      <DashboardFeature />
    </div>
  );
}
