'use client';

import { AdminOrder } from '@/services/order/types';
import { Button } from '@/components/button/Button';
import { OrderStatusBadge } from '@/features/order-history/components/OrderStatusBadge';

interface Props {
  order: AdminOrder | null;
  onClose: () => void;
}

const paymentBadgeClass: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
};

export function AdminOrderDetailModal({ order, onClose }: Props) {
  if (!order) return null;

  const total = parseFloat(order.totalAmount).toFixed(2);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Order #{order.id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {order.user.name} &middot; {order.user.email}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Items
          </h3>
          <div className="flex flex-col">
            {order.items.map((item) => {
              const unit = parseFloat(item.priceAtPurchase);
              const subtotal = unit * item.quantity;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.quantity} &times; Rs. {unit.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-semibold text-sm shrink-0">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center font-bold text-foreground text-base py-3 border-t border-border mb-6">
          <span>Total</span>
          <span>Rs. {parseFloat(order.totalAmount).toLocaleString()}</span>
        </div>

        {/* Shipping */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Shipping Address
          </h3>
          <p className="text-sm text-foreground bg-muted rounded-lg px-4 py-3">
            {order.shippingAddress}
          </p>
        </div>

        {/* Payment */}
        {order.payment && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Payment
            </h3>
            <div className="flex items-center gap-3 bg-muted rounded-lg px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground capitalize">
                  {order.payment.provider}
                </p>
                {order.payment.transactionId && (
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                    Txn: {order.payment.transactionId}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  paymentBadgeClass[order.payment.status] ?? 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.payment.status.charAt(0) + order.payment.status.slice(1).toLowerCase()}
              </span>
            </div>
          </div>
        )}

        <Button variant="outline" fullWidth onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
