export const dynamic = 'force-dynamic';

import { getCurrentUser } from '@/actions/getCurrentUser';
import Container from '../components/Container';
import ProfileClient from './Profileclient';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  return (
    <div className='pt-8 pb-16'>
      <Container>
        <ProfileClient currentUser={currentUser} />
      </Container>
    </div>
  );
};

export default ProfilePage;
