'use client';

import { Search } from 'lucide-react';

interface ProductListHeaderProps {
  totalCount?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProductListHeader = ({ totalCount, searchQuery, onSearchChange }: ProductListHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
          All Products
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalCount !== undefined ? `${totalCount} products` : 'Loading products...'}
        </p>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
};
