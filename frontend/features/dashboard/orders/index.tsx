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
import { useAppSelector } from '@/store/hooks';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const TERMINAL_STATUSES: OrderStatus[] = ['DELIVERED', 'CANCELLED'];

function getNextStatuses(current: OrderStatus): OrderStatus[] {
  if (TERMINAL_STATUSES.includes(current)) return [];
  return ALL_STATUSES.filter((s) => s !== current);
}

function OrderStatusSelect({ order }: { order: AdminOrder }) {
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const nextStatuses = getNextStatuses(order.status);

  if (nextStatuses.length === 0) {
    return <span className="text-xs text-muted-foreground">No actions</span>;
  }

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (!newStatus) return;
    try {
      await updateStatus({ id: order.id, body: { status: newStatus } }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? 'Failed to update status');
    }
  };

  return (
    <select
      defaultValue=""
      onChange={handleChange}
      disabled={isLoading}
      className="text-sm border border-border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="" disabled>
        Change status
      </option>
      {nextStatuses.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}

export default function AdminOrdersFeature() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { user } = useAppSelector((s) => s.auth);

  const { data, isLoading } = useGetAllOrdersQuery({ page, limit });

  const orders = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-muted-foreground">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? 'Loading...' : `${total} total orders`}
        </p>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 text-muted-foreground"
              >
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
              const total = parseFloat(order.totalAmount).toFixed(2);
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(-8)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {order.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{itemCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-sm">${total}</span>
                  </TableCell>
                  <TableCell>
                    {order.payment ? (
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
                        {order.payment.status.charAt(0) +
                          order.payment.status.slice(1).toLowerCase()}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <OrderStatusSelect order={order} />
                  </TableCell>
                </TableRow>
              );
            })
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
    </div>
  );
}
