export interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
}
