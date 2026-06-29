import { baseApi } from '../baseApi';
import { AnalyticsResponse } from './types';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => '/admin/analytics',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetAnalyticsQuery } = adminApi;
