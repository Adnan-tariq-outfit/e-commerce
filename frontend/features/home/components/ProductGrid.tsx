import { Product } from '../../../services/product/types';
import { ProductCard } from './ProductCard';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
  error?: any;
}

export const ProductGrid = ({ products, isLoading, error }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-danger/10 rounded-2xl border border-danger/20">
        <div className="text-danger font-bold text-xl mb-2">Failed to load products</div>
        <p className="text-danger/80">Please try again later.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-muted rounded-2xl border border-border">
        <div className="text-muted-foreground font-bold text-xl mb-2">No products found</div>
        <p className="text-muted-foreground/80">Check back later for new arrivals.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
