import Container from '@/app/components/Container';
import ProductDetails from './ProductDetails';
import ListRating from './ListRating';
import getProductById from '@/actions/getProductById';
import NullData from '@/app/components/NullData';
import { getCurrentUser } from '@/actions/getCurrentUser';
import AddRating from './AddRating';
import RelatedProducts from './RelatedProducts';

interface Iparams {
  productId?: string;
}

const Horizontal = () => {
  return <hr className='w-[30%] my-2' />;
};

const Product = async ({ params }: { params: Iparams }) => {
  const product = await getProductById(params);
  const user = getCurrentUser();

  if (!product)
    return <NullData title='Oops! Product with the given id does not exist' />;

  return (
    <div className=''>
      <Container>
        <ProductDetails product={product} />
        <div className='flex flex-col mt=20 gap-4'>
          <AddRating product={product} user={user} />
          <ListRating product={product} />
          <div className='p-2 md:p-3 mt-8'></div>
          <div className='md:p-2'>
            <RelatedProducts
              category={product.category}
              excludeId={product.id}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Product;
