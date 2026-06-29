import { baseApi } from '../baseApi';
import {
  Order,
  AdminOrder,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  PaginatedOrders,
  OrderStatus,
} from './types';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),

    getMyOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),

    getAllOrders: builder.query<PaginatedOrders, { page: number; limit: number; status?: OrderStatus }>({
      query: ({ page, limit, status }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.set('status', status);
        return `/orders/admin/all?${params.toString()}`;
      },
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<AdminOrder, { id: string; body: UpdateOrderStatusRequest }>({
      query: ({ id, body }) => ({
        url: `/orders/admin/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
