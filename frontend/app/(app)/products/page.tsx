import { Suspense } from 'react';
import { ProductListView } from '../../../features/products/ProductListView';

export const metadata = {
  title: 'All Products | FORMA',
  description: 'Browse all curated products.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductListView />
    </Suspense>
  );
}
