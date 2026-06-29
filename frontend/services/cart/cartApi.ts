import { baseApi } from '../baseApi';
import { Cart, AddToCartRequest } from './types';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<Cart, AddToCartRequest>({
      query: (body) => ({
        url: '/cart/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),

    updateCartItem: builder.mutation<Cart, { itemId: string; quantity: number }>({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    removeCartItem: builder.mutation<{ message: string }, string>({
      query: (itemId) => ({
        url: `/cart/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    clearCart: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
