'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGetProductsQuery } from '../../services/product/productApi';
import { useGetCategoriesQuery } from '../../services/category/categoryApi';
import { ProductListHeader } from './components/ProductListHeader';
import { ProductSidebar } from './components/ProductSidebar';
import { ExtendedProductCard } from '../home/components/ExtendedProductCard';
import { Loader2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '../../components/pagination/Pagination';
export const ProductListView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('categoryId'),
  );
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sortBy') ?? 'newest',
  );

  useEffect(() => {
    setSelectedCategory(searchParams.get('categoryId'));
    setSortBy(searchParams.get('sortBy') ?? 'newest');
    setPage(1);
  }, [searchParams]);

  const { data: categoriesData } = useGetCategoriesQuery();

  const { data: productsData, isLoading, error, isFetching } = useGetProductsQuery({
    page,
    limit: 12,
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategory && { categoryId: selectedCategory }),
    ...(maxPrice < 500000 && { maxPrice }),
    sortBy,
  });

  const updateUrl = (categoryId: string | null, sort: string) => {
    const params = new URLSearchParams();
    if (categoryId) params.set('categoryId', categoryId);
    if (sort !== 'newest') params.set('sortBy', sort);
    const qs = params.toString();
    router.replace(qs ? `/products?${qs}` : '/products', { scroll: false });
  };

  const handleSelectCategory = (id: string | null) => {
    setSelectedCategory(id);
    setPage(1);
    updateUrl(id, sortBy);
  };

  const handleSortByChange = (s: string) => {
    setSortBy(s);
    setPage(1);
    updateUrl(selectedCategory, s);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setMaxPrice(500000);
    setSortBy('newest');
    setPage(1);
    router.replace('/products', { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const meta = productsData?.meta;
  const products = productsData?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <ProductListHeader
          totalCount={meta?.total}
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setPage(1); }}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <ProductSidebar
            categories={categoriesData}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={(p) => { setMaxPrice(p); setPage(1); }}
            sortBy={sortBy}
            onSortByChange={handleSortByChange}
            onClearAll={handleClearAll}
            totalCount={!selectedCategory ? meta?.total : undefined}
          />

          <main className="flex-1">
            {isLoading ? (
              <div className="w-full flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : error ? (
              <div className="w-full flex flex-col items-center justify-center p-10 bg-danger/10 rounded-2xl border border-danger/20">
                <div className="text-danger font-bold text-xl mb-2">Failed to load products</div>
                <p className="text-danger/80">Please try again later.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="w-full flex justify-center py-20 bg-muted rounded-2xl border border-border">
                <p className="text-muted-foreground font-medium">No products match your filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {isFetching && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ExtendedProductCard
                      key={product.id}
                      product={product}
                      variant="newArrival"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => page > 1 && handlePageChange(page - 1)}
                            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>

                        {Array.from({ length: meta.totalPages }).map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === meta.totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1)
                          ) {
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  isActive={pageNum === page}
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (pageNum === page - 2 || pageNum === page + 2) {
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => page < meta.totalPages && handlePageChange(page + 1)}
                            className={page === meta.totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
