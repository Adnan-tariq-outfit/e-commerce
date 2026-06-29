'use client';

import Skeleton from '@/components/skeleton/Skeleton';
import { ExtendedProductCard } from '@/features/home/components/ExtendedProductCard';
import { useGetProductsQuery } from '@/services/product/productApi';

interface RelatedProductsProps {
  categoryId: string;
  excludeId: string;
}

export function RelatedProducts({ categoryId, excludeId }: RelatedProductsProps) {
  const { data, isLoading } = useGetProductsQuery({ categoryId, limit: 7 });

  if (isLoading) {
    return (
      <section>
        <div className="mb-8">
          <Skeleton className="h-3 w-32 mb-3" />
          <Skeleton className="h-9 w-56 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  const related = data?.data.filter((p) => p.id !== excludeId).slice(0, 6) ?? [];

  if (related.length === 0) return null;

  return (
    <section>
      <div className="mb-8 sm:mb-12">
        <span className="text-xs font-bold tracking-widest text-primary uppercase">
          RELEVANT TO YOU
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-2">
          You may also like
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Based on this category and your browsing history
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((product) => (
          <ExtendedProductCard key={product.id} product={product} variant="newArrival" />
        ))}
      </div>
    </section>
  );
}
