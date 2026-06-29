'use client';

import { useGetProductsQuery } from '../../../services/product/productApi';
import { SectionHeader } from './SectionHeader';
import { ExtendedProductCard } from './ExtendedProductCard';
import { Loader2 } from 'lucide-react';

export const NewArrivalsSection = () => {
  // Use page 2 just to get a different set of products for the demo
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 4,
    sortBy: 'newest',
  });

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          eyebrow="Just In" 
          title="New Arrivals" 
          viewAllLink="/products?sortBy=newest"
        />

        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : error ? (
          <div className="w-full flex flex-col items-center justify-center p-10 bg-danger/10 rounded-2xl border border-danger/20">
            <div className="text-danger font-bold text-xl mb-2">Failed to load new arrivals</div>
            <p className="text-danger/80">Please try again later.</p>
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="w-full flex justify-center py-20 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground font-medium">No new arrivals found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.data.map((product) => (
              <ExtendedProductCard 
                key={product.id} 
                product={product} 
                variant="newArrival" 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
