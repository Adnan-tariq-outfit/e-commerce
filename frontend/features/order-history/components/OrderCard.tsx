import { Order } from '@/services/order/types';
import { Button } from '@/components/button/Button';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const shortId = `#${order.id.slice(-8)}`;
  const date = new Date(order.createdAt).toLocaleDateString();
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = parseFloat(order.totalAmount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-foreground">{shortId}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-sm text-muted-foreground">{date}</p>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} &middot; {total}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails(order.id)}
      >
        View Details
      </Button>
    </div>
  );
}
