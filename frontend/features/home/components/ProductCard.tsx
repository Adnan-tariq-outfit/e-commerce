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
      <div className={`relative aspect-[16/9] w-full ${bgClass} flex items-center justify-center p-4 overflow-hidden`}>
        {/* Subtle background gradient or pattern can go here */}
        
        {hasImage ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-contain relative z-10 transition-opacity duration-300"
          />
        ) : (
          <div className="text-white relative z-10 transition-opacity duration-300">
            {product.category?.slug === 'electronics' || product.name.toLowerCase().includes('watch') ? (
              <Watch size={64} className="text-primary" />
            ) : (
              <ImageIcon size={64} className="text-muted-foreground" />
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col gap-1 bg-card flex-grow">
        <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {product.category?.name || 'Electronics'}
        </div>
        <h3 className="font-semibold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="text-primary font-bold mt-1">
          ${parseFloat(product.price).toFixed(2)}
        </div>
      </div>
    </Link>
  );
};
