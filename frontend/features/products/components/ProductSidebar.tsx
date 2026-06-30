'use client';

import { Category } from '../../../services/category/types';

interface ProductSidebarProps {
  categories?: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  onClearAll: () => void;
  totalCount?: number;
}

export const ProductSidebar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortByChange,
  onClearAll,
  totalCount
}: ProductSidebarProps) => {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-8">
        
        {/* Category Filter */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-foreground uppercase mb-4">
            Category
          </h3>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                onClick={() => onSelectCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === null 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>All Products</span>
                {totalCount !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === null ? 'bg-primary/20' : 'bg-muted-foreground/10'}`}>
                    {totalCount}
                  </span>
                )}
              </button>
            </li>
            {categories?.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span>{category.name}</span>
                  {/* If we had category counts, we'd show them here. For now, omit or show a placeholder */}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Max Price Filter */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-foreground uppercase mb-4">
            Max Price
          </h3>
          <div className="flex items-center justify-between text-sm font-medium mb-4">
            <span className="text-muted-foreground">Rs. 0</span>
            <span className="text-primary">Rs. {maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Sort By */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-foreground uppercase mb-4">
            Sort By
          </h3>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full bg-card border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Clear All */}
        <button
          onClick={onClearAll}
          className="w-full py-2.5 px-4 text-sm font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Clear all
        </button>

      </div>
    </aside>
  );
};
