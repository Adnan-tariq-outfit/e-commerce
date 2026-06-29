import Link from 'next/link';
import { Product } from '../../../services/product/types';
import { getImageUrl } from '../../../lib/imageUrl';
import { Watch, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const hasImage = product.images && product.images.length > 0;
  
  // Generate a pseudo-random color based on the product ID to match the screenshot's varying backgrounds
  const colorIndex = product.id.charCodeAt(product.id.length - 1) % 4;
  const gradients = [
    'from-blue-900 to-slate-900', // watch
    'from-indigo-950 to-purple-950', // coat
    'from-teal-950 to-slate-900', // chair
    'from-slate-900 to-indigo-950', // floppy
  ];
  const bgClass = `bg-gradient-to-br ${gradients[colorIndex]}`;

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
      <div className="relative aspect-square w-full bg-background flex items-center justify-center overflow-hidden p-3">
        {hasImage ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover object-center rounded-lg"
          />
        ) : (
          <div>
            {product.category?.slug === 'electronics' || product.name.toLowerCase().includes('watch') ? (
              <Watch size={64} className="text-muted-foreground" />
            ) : (
              <ImageIcon size={64} className="text-muted-foreground" />
            )}
          </div>
        )}
      </div>
      
    </Link>
  );
};
