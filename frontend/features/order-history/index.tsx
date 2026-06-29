'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useGetMyOrdersQuery } from '@/services/order/orderApi';
import Skeleton from '@/components/skeleton/Skeleton';
import { OrderCard } from './components/OrderCard';
import { OrderDetailModal } from './components/OrderDetailModal';

export default function OrderHistoryFeature() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={52} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="text-muted-foreground">
          You haven&apos;t placed any orders. Start shopping to see your orders here.
        </p>
        <Link
          href="/products"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Order History</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={setSelectedOrderId}
          />
        ))}
      </div>

      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
}
