import { baseApi } from '../baseApi';
import {
  Order,
  AdminOrder,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  PaginatedOrders,
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

    getAllOrders: builder.query<PaginatedOrders, { page: number; limit: number }>({
      query: ({ page, limit }) => `/orders/admin/all?page=${page}&limit=${limit}`,
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<AdminOrder, { id: string; body: UpdateOrderStatusRequest }>({
      query: ({ id, body }) => ({
        url: `/orders/admin/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id },
      ],
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
