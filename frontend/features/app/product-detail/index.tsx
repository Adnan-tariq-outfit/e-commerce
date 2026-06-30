'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Star, Minus, Plus, Image as ImageIcon } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useGetProductQuery, useRecordViewMutation } from '@/services/product/productApi';
import { useAddToCartMutation } from '@/services/cart/cartApi';
import { Button } from '@/components/button/Button';
import Skeleton from '@/components/skeleton/Skeleton';
import { Badge } from '@/components/badge/Badge';
import { getImageUrl } from '@/lib/imageUrl';
import { RelatedProducts } from './components/RelatedProducts';

interface ProductDetailFeatureProps {
  id: string;
}

export function ProductDetailFeature({ id }: ProductDetailFeatureProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: product, isLoading } = useGetProductQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [recordView] = useRecordViewMutation();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      recordView(id);
    }
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await addToCart({ productId: id, quantity }).unwrap();
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Skeleton className="aspect-square w-full rounded-2xl mb-3" />
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="aspect-square w-full rounded-lg" />)}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const rating = (4.0 + (product.id.charCodeAt(0) % 10) / 10).toFixed(1);
  const reviewCount = (product.id.charCodeAt(0) * 17 + 342).toLocaleString();

  const stockStatus =
    product.stockQty === 0
      ? { label: 'Out of stock', cls: 'text-red-500' }
      : product.stockQty <= 5
      ? { label: 'Low stock', cls: 'text-orange-500' }
      : { label: 'In stock', cls: 'text-green-500' };

  const hasImages = product.images && product.images.length > 0;
  const thumbnails = product.images.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Left — Image gallery */}
        <div>
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-card border border-border flex items-center justify-center">
            {hasImages ? (
              <img
                src={getImageUrl(product.images[activeImage])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={72} className="text-muted-foreground" />
            )}
          </div>

          {thumbnails.length > 1 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {thumbnails.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? 'border-primary'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Product details */}
        <div className="flex flex-col gap-4">
          <Badge variant="purple" className="self-start">{product.category.name.toUpperCase()}</Badge>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={16} className="fill-yellow-400" />
              ))}
            </div>
            <span className="font-semibold text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-foreground">Rs. {price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  Rs. {originalPrice.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${stockStatus.cls.replace('text-', 'bg-')}`} />
            <span className={`text-sm font-medium ${stockStatus.cls}`}>{stockStatus.label}</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-medium text-foreground">Quantity</span>
            <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
                className="px-3 py-2 text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-foreground min-w-[3rem] text-center border-x border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                disabled={quantity >= product.stockQty}
                className="px-3 py-2 text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isAdding}
              disabled={product.stockQty === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Link
              href="/cart"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground border border-border rounded-xl hover:bg-muted transition-colors"
            >
              View Cart →
            </Link>
          </div>
        </div>
      </div>

      {/* Related products */}
      <RelatedProducts categoryId={product.category.id} excludeId={product.id} />
    </div>
  );
}
