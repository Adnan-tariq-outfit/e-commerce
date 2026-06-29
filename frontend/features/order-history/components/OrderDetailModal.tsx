'use client';

import { useGetMyOrderQuery } from '@/services/order/orderApi';
import { Button } from '@/components/button/Button';
import Skeleton from '@/components/skeleton/Skeleton';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailModalProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const { data: order, isLoading } = useGetMyOrderQuery(orderId!, { skip: !orderId });

  if (!orderId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {isLoading || !order ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Order #{order.id.slice(-8)}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
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
              <div className="flex flex-col gap-3">
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
                          {item.quantity} &times; ${unit.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-semibold text-sm shrink-0">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center font-bold text-foreground text-base py-3 border-t border-border mb-6">
              <span>Total</span>
              <span>
                ${parseFloat(order.totalAmount).toFixed(2)}
              </span>
            </div>

            {/* Shipping address */}
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
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Txn: {order.payment.transactionId}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : order.payment.status === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : order.payment.status === 'REFUNDED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.payment.status.charAt(0) + order.payment.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Close */}
            <Button variant="outline" fullWidth onClick={onClose}>
              Close
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
