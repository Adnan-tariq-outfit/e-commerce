'use client';

import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { BestsellersSection } from './components/BestsellersSection';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { TrustSection } from './components/TrustSection';
import { useGetProductsQuery } from '../../services/product/productApi';

export const HomeView = () => {
  const { data, isLoading, error } = useGetProductsQuery({ 
    limit: 4 
  });

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Top Hero + Grid Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 lg:pt-8 lg:pb-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 xl:gap-16">
          {/* Left Column - Hero Section */}
          <div className="w-full lg:w-1/2 flex items-center">
            <HeroSection />
          </div>

          {/* Right Column - Product Grid */}
          <div className="w-full lg:w-1/2 flex items-center">
            <ProductGrid 
              products={data?.data} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <BestsellersSection />

      {/* New Arrivals Section */}
      <NewArrivalsSection />

      {/* Trust/Features Section */}
      <TrustSection />
    </div>
  );
};
