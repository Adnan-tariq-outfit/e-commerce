'use client';

import Link from 'next/link';
import { ArrowDown, Star, Tag } from 'lucide-react';
import { useGetCategoriesQuery } from '../../../services/category/categoryApi';

export const HeroSection = () => {
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();

  const topCategories = [...(categories ?? [])]
    .sort((a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0))
    .slice(0, 4);

  return (
    <div className="flex flex-col justify-center pt-2 pb-10 lg:pt-4 lg:pb-20 pr-0 lg:pr-10">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 w-fit border border-primary/20">
        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
        Free shipping on orders over $100
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-2xl text-foreground leading-[1.1]">
        Designed for how you <span className="text-primary italic font-serif">live.</span>
      </h1>

      <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
        Curated electronics, fashion, and home goods — selected for quality that lasts a lifetime.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Link
          href="/products"
          className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Shop All Products
        </Link>
        <Link
          href="/products?sortBy=price_desc"
          className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-border bg-transparent px-8 text-base font-semibold text-foreground transition-colors hover:bg-muted hover:border-foreground/20 gap-2"
        >
          View Bestsellers <ArrowDown size={18} />
        </Link>
      </div>

      {/* Top Categories */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Shop by Category
        </p>
        {loadingCategories ? (
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-28 rounded-full bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {topCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <Tag size={13} />
                {cat.name}
                <span className="text-[11px] opacity-60">{cat._count?.products ?? 0}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-12 pt-8 border-t border-border">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">50k+</div>
          <div className="text-sm text-muted-foreground font-medium">Customers</div>
        </div>
        <div className="h-10 sm:h-12 w-px bg-border hidden sm:block"></div>
        <div>
          <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold text-foreground mb-1">
            4.9<Star className="fill-foreground text-foreground" size={20} />
          </div>
          <div className="text-sm text-muted-foreground font-medium">Avg Rating</div>
        </div>
        <div className="h-10 sm:h-12 w-px bg-border hidden sm:block"></div>
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">200+</div>
          <div className="text-sm text-muted-foreground font-medium">Products</div>
        </div>
      </div>
    </div>
  );
};
