import getProducts from '@/actions/getProducts';

export default async function getRelatedProducts(
  category: string,
  excludeId: string,
) {
  const products = await getProducts({ category });
  return products.filter((p) => p.id !== excludeId);
}
