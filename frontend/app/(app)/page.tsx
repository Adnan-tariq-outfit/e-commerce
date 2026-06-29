import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-20 px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl text-balance">
        Curated products designed for modern living.
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl text-balance">
        Quality that stands the test of time. Discover our collection of premium electronics, fashion, and home goods.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/products" 
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-2"
        >
          Shop All Products <ArrowRight size={16} />
        </Link>
        <Link 
          href="/products?category=electronics" 
          className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Explore Electronics
        </Link>
      </div>
    </div>
  );
}
