export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface OrderProduct {
  id: string
  name: string
  images: string[]
  price: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  priceAtPurchase: string
  product: OrderProduct
}

export interface OrderPayment {
  id: string
  provider: string
  status: PaymentStatus
  amount: string
  transactionId: string | null
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  totalAmount: string
  shippingAddress: string
  createdAt: string
  items: OrderItem[]
  payment: OrderPayment | null
}

export interface AdminOrder extends Order {
  user: { id: string; name: string; email: string }
}

export interface CreateOrderRequest {
  shippingAddress: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
}

export interface PaginatedOrders {
  data: AdminOrder[]
  total: number
  page: number
  limit: number
}
