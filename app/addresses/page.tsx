export const dynamic = 'force-dynamic';

import { getCurrentUser } from '@/actions/getCurrentUser';
import Container from '../components/Container';
import AddressBook from './AddressBook';
import { redirect } from 'next/navigation';

const AddressPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  return (
    <div className='pt-8 pb-16'>
      <Container>
        <AddressBook />
      </Container>
    </div>
  );
};

export default AddressPage;
