import Link from 'next/link';
import { Product } from '../../../services/product/types';
import { getImageUrl } from '../../../lib/imageUrl';
import { Watch, Image as ImageIcon, Plus, Star } from 'lucide-react';

interface ExtendedProductCardProps {
  product: Product;
  variant: 'bestseller' | 'newArrival';
}

export const ExtendedProductCard = ({ product, variant }: ExtendedProductCardProps) => {
  const hasImage = product.images && product.images.length > 0;
  
  // Calculate discount if originalPrice exists and is greater than price
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  
  let discountPercentage = 0;
  if (originalPrice && originalPrice > price) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  // Generate deterministic mock review data based on product ID
  const reviewCount = (product.id.charCodeAt(0) * 17 + 342).toLocaleString();
  const starRating = 4.8; // Hardcoded high rating for demo

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out h-full">
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full bg-[#13172e] flex items-center justify-center p-6 overflow-hidden">
        {/* Badges */}
        {variant === 'bestseller' && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            <Star size={10} className="text-yellow-400 fill-yellow-400" /> Best
          </div>
        )}
        
        {variant === 'newArrival' && (
          <div className="absolute top-3 left-3 z-20 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            New
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute bottom-3 left-3 z-20 bg-danger text-danger-foreground text-[10px] font-bold px-2 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}
        
        {hasImage ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-contain relative z-10 transition-opacity duration-300"
          />
        ) : (
          <div className="text-white relative z-10 transition-opacity duration-300">
            {product.category?.slug === 'electronics' || product.name.toLowerCase().includes('watch') ? (
              <Watch size={56} className="text-primary" />
            ) : (
              <ImageIcon size={56} className="text-muted-foreground" />
            )}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col gap-1.5 flex-grow relative">
        <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {product.category?.name || 'Category'}
        </div>
        
        <h3 className="font-semibold text-sm sm:text-base text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex text-yellow-400">
            <Star size={10} className="fill-yellow-400" />
            <Star size={10} className="fill-yellow-400" />
            <Star size={10} className="fill-yellow-400" />
            <Star size={10} className="fill-yellow-400" />
            <Star size={10} className="fill-yellow-400" />
          </div>
          <span className="text-[11px] text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-card-foreground">
              ${price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <button className="h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-colors shadow-sm" aria-label="Add to cart" onClick={(e) => e.preventDefault()}>
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  );
};
