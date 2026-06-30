import { Suspense } from 'react';
import Container from '../components/Container';
import FormWrap from '../components/FormWrap';
import CheckoutClient from './CheckoutClient';
import LoadingSpinner from '../components/LoadingSpinner';

export const metadata = {
  title: 'Checkout - Emart GH',
  description: 'Checkout page for Emart GH',
};

const Checkout = () => {
  return (
    <div className='px-2 py-4'>
      <Container>
        <Suspense
          fallback={
            <>
              <LoadingSpinner fullPage />
            </>
          }
        >
          <CheckoutClient />
        </Suspense>
      </Container>
    </div>
  );
};

export default Checkout;
