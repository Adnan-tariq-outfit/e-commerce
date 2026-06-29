'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '@/services/cart/cartApi';
import { CartItem } from '@/services/cart/types';
import { Button } from '@/components/button/Button';
import Skeleton from '@/components/skeleton/Skeleton';
import { getImageUrl } from '@/lib/imageUrl';

export default function CartFeature() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: cart, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={52} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-muted-foreground">Sign in to view your cart and continue shopping.</p>
        <Link href="/login">
          <Button size="lg">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full mb-4 rounded-xl" />
        ))}
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={52} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Browse our products and add something you like.</p>
        <Link href="/products">
          <Button size="lg">Shop now</Button>
        </Link>
      </div>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0,
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = async (item: CartItem, delta: number) => {
    try {
      await updateCartItem({ itemId: item.id, quantity: item.quantity + delta }).unwrap();
    } catch {
      toast.error('Could not update quantity');
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeCartItem(itemId).unwrap();
      toast.success('Item removed');
    } catch {
      toast.error('Could not remove item');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart().unwrap();
      toast.success('Cart cleared');
    } catch {
      toast.error('Could not clear cart');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">
        Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items list */}
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => {
            const price = parseFloat(item.product.price);
            const hasImage = item.product.images && item.product.images.length > 0;
            return (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                {/* Image */}
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ShoppingBag size={28} className="text-muted-foreground" />
                  )}
                </div>

                {/* Info + controls */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">${price.toFixed(2)} each</p>

                  {/* Quantity stepper */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={item.quantity <= 1}
                      className="h-7 w-7 rounded-md border border-input flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      disabled={item.quantity >= item.product.stockQty}
                      className="h-7 w-7 rounded-md border border-input flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal + remove */}
                <div className="flex flex-col items-end justify-between shrink-0">
                  <span className="font-bold text-sm">${(price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:w-72 shrink-0">
          <div className="p-6 rounded-xl border border-border bg-card flex flex-col gap-4 sticky top-24">
            <h2 className="font-bold text-lg">Order Summary</h2>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="border-t border-border pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="w-full">
              <Button fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>

            <Button variant="outline" fullWidth onClick={handleClear} isLoading={isClearing}>
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
