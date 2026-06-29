export interface CartProduct {
  id: string;
  name: string;
  price: string;
  originalPrice: string | null;
  images: string[];
  stockQty: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface Cart {
  id: string;
  userId: string;
  updatedAt: string;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
