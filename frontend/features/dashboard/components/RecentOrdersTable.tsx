import Link from 'next/link';
import { RecentOrder } from '@/services/admin/types';

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  CONFIRMED: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  SHIPPED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  DELIVERED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="font-semibold text-base">Recent Orders</h2>
        <Link
          href="/dashboard/orders"
          className="text-sm text-primary hover:underline underline-offset-2"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-t border-border/40">
            <tr>
              {['ORDER', 'CUSTOMER', 'DATE', 'STATUS', 'TOTAL'].map((h, i) => (
                <th
                  key={h}
                  className={`py-3 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const badge = STATUS_BADGE[order.status] ?? {
                bg: 'bg-gray-100',
                text: 'text-gray-700',
              };
              const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return (
                <tr
                  key={order.id}
                  className="border-t border-border/40 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-primary">{order.displayId}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-foreground">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{date}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold tabular-nums">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
