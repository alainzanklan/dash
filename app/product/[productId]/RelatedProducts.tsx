import getRelatedProducts from '@/actions/getRelatedProducts';
import { ProductSlider } from './ProductSlider';

export const revalidate = 0;

interface RelatedProductProps {
  category: string;
  excludeId: string;
}

export default async function RelatedProducts({
  category,
  excludeId,
}: RelatedProductProps) {
  const products = await getRelatedProducts(category, excludeId);

  if (products.length === 0) return null;

  const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 12);

  return <ProductSlider products={shuffled} category={category} />;
}
