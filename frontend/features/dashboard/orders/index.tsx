'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/services/order/orderApi';
import { OrderStatus, AdminOrder } from '@/services/order/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table/Table';
import { Button } from '@/components/button/Button';
import Skeleton from '@/components/skeleton/Skeleton';
import { OrderStatusBadge } from '@/features/order-history/components/OrderStatusBadge';
import { AdminOrderDetailModal } from './components/AdminOrderDetailModal';
import { useAppSelector } from '@/store/hooks';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const TERMINAL_STATUSES: OrderStatus[] = ['DELIVERED', 'CANCELLED'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

function getNextStatuses(current: OrderStatus): OrderStatus[] {
  if (TERMINAL_STATUSES.includes(current)) return [];
  return ALL_STATUSES.filter((s) => s !== current);
}

function OrderStatusSelect({ order }: { order: AdminOrder }) {
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const nextStatuses = getNextStatuses(order.status);

  if (nextStatuses.length === 0) {
    return <OrderStatusBadge status={order.status} />;
  }

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (!newStatus || newStatus === order.status) return;
    try {
      await updateStatus({ id: order.id, body: { status: newStatus } }).unwrap();
      toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? 'Failed to update status');
    }
  };

  return (
    <select
      key={order.status}
      defaultValue={order.status}
      onChange={handleChange}
      disabled={isLoading}
      className="text-sm border border-border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value={order.status}>{STATUS_LABELS[order.status]}</option>
      {nextStatuses.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

export default function AdminOrdersFeature() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | null>(null);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const limit = 10;
  const { user } = useAppSelector((s) => s.auth);

  // Main paginated query for the current filter
  const { data, isLoading } = useGetAllOrdersQuery({
    page,
    limit,
    status: activeStatus ?? undefined,
  });

  // Separate query for tab counts — load up to 50 unfiltered to derive counts
  const { data: countData } = useGetAllOrdersQuery({ page: 1, limit: 50 });

  const orders = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const allOrdersForCount = countData?.data ?? [];
  const totalAll = countData?.total ?? 0;

  const countByStatus = allOrdersForCount.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const handleTabChange = (status: OrderStatus | null) => {
    setActiveStatus(status);
    setPage(1);
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-muted-foreground">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? 'Loading...' : `${total} total orders`}
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTabChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            activeStatus === null
              ? 'bg-foreground text-background border-foreground'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/50'
          }`}
        >
          All ({totalAll})
        </button>
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => handleTabChange(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeStatus === status
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/50'
            }`}
          >
            {STATUS_LABELS[status]} ({countByStatus[status] ?? 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="font-mono text-xs text-primary hover:underline"
                  >
                    #{order.id.slice(-8).toUpperCase()}
                  </button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.user.name}</p>
                    <p className="text-xs text-muted-foreground">{order.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-sm">
                    ${parseFloat(order.totalAmount).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <OrderStatusSelect order={order} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} &middot; {total} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      <AdminOrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
