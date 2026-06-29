import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <LayoutGrid size={16} />
              </div>
              <span className="font-bold text-lg tracking-tight">FORMA</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Curated products designed for modern living. Quality that stands the test of time.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Shop</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/products" className="hover:text-foreground transition-colors">All Products</Link>
              <Link href="/products?category=electronics" className="hover:text-foreground transition-colors">Electronics</Link>
              <Link href="/products?category=fashion" className="hover:text-foreground transition-colors">Fashion</Link>
              <Link href="/products?category=home" className="hover:text-foreground transition-colors">Home & Living</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Company</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
              <Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link>
              <Link href="/press" className="hover:text-foreground transition-colors">Press</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Support</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link>
              <Link href="/returns" className="hover:text-foreground transition-colors">Returns</Link>
              <Link href="/track" className="hover:text-foreground transition-colors">Track Order</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/40 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FORMA. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
