import { Truck, Undo2, Shield } from 'lucide-react';

export const TrustSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-primary uppercase mb-4 block">
            Why Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Built on trust
          </h2>
          <p className="text-lg text-muted-foreground">
            Every product tested, every order insured.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Truck className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Free Shipping</h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              On all orders over $100. Express delivery with 2-3 business day guarantee.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Undo2 className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">Easy Returns</h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              30-day hassle-free returns. Full refund within 5 business days.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Shield className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-3">2-Year Warranty</h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Every product includes our quality guarantee, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
