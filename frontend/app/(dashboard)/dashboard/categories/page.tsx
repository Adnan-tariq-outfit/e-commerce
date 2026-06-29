import { CategoriesTable } from '@/features/dashboard/categories';

export const metadata = {
  title: 'Categories | FORMA Admin',
  description: 'Manage your product categories',
};

export default function CategoriesPage() {
  return <CategoriesTable />;
}
