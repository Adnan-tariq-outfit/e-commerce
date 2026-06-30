'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useGetCartQuery } from '@/services/cart/cartApi';
import { useCreateOrderMutation } from '@/services/order/orderApi';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/button/Button';
import Skeleton from '@/components/skeleton/Skeleton';

const checkoutSchema = yup.object().shape({
  shippingAddress: yup
    .string()
    .min(10, 'Shipping address must be at least 10 characters')
    .required('Shipping address is required'),
});

type CheckoutFormType = yup.InferType<typeof checkoutSchema>;

export default function CheckoutFeature() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: cart, isLoading: isCartLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormType>({
    mode: 'onTouched',
    resolver: yupResolver(checkoutSchema),
    defaultValues: { shippingAddress: '' },
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={52} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold">Sign in to checkout</h1>
        <p className="text-muted-foreground">You need to be signed in to place an order.</p>
        <Link href="/login">
          <Button size="lg">Sign in</Button>
        </Link>
      </div>
    );
  }

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Skeleton className="h-8 w-40 mb-8 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-xl mb-6" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={52} className="text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some items to your cart before checking out.</p>
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

  const onSubmit = async (data: CheckoutFormType) => {
    try {
      await createOrder({ shippingAddress: data.shippingAddress }).unwrap();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col gap-6">
        {/* Cart summary */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const price = parseFloat(item.product.price);
              return (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold shrink-0">
                    Rs. {(price * item.quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
            <div>
              <label
                htmlFor="shippingAddress"
                className="text-sm font-medium text-foreground mb-1.5 block"
              >
                Delivery address
              </label>
              <textarea
                id="shippingAddress"
                rows={4}
                placeholder="Enter your full shipping address..."
                className="w-full px-4 py-2.5 bg-muted rounded-xl border border-transparent focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-all placeholder:text-muted-foreground text-sm resize-none"
                {...register('shippingAddress')}
              />
              {errors.shippingAddress && (
                <p className="text-sm text-destructive mt-1">
                  {errors.shippingAddress.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isPlacingOrder}
          >
            Place Order
          </Button>
        </form>
      </div>
    </div>
  );
}
