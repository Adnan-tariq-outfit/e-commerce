import { ProductsTable } from '@/features/dashboard/products';

export const metadata = {
  title: 'Products | FORMA Admin',
  description: 'Manage your product catalog',
};

export default function ProductsPage() {
  return <ProductsTable />;
}
