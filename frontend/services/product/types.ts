import { Category } from '../category/types';

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  description: string;
  price: string;
  originalPrice: string | null;
  images: string[];
  tags: string[];
  stockQty: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  maxPrice?: number;
  sortBy?: string;
}

export interface CreateProductRequest {
  formData: FormData;
}

export interface UpdateProductRequest {
  id: string;
  formData: FormData;
}
