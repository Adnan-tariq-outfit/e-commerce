import { ProductDetailFeature } from '@/features/app/product-detail';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailFeature id={id} />;
}
