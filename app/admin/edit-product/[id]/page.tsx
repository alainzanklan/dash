import Container from '@/app/components/Container';
import EditProductForm from './EditProductForm';
import FormWrap from '@/app/components/FormWrap';
import { Suspense } from 'react';

interface EditProductPageProps {
  params: { id: string };
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${params.id}`,
    { cache: 'no-store' },
  );
  const product = await res.json();

  if (!product) {
    return (
      <div className='flex items-center justify-center h-40 text-slate-500'>
        Product not found.
      </div>
    );
  }

  return (
    <div className='p-4'>
      <Container>
        <FormWrap>
          <Suspense fallback={<>Loading...</>}>
            <EditProductForm product={product} />
          </Suspense>
        </FormWrap>
      </Container>
    </div>
  );
};

export default EditProductPage;
