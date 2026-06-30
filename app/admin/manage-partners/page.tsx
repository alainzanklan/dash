import { getCurrentUser } from '@/actions/getCurrentUser';
import NullData from '@/app/components/NullData';
import Container from '@/app/components/Container';
import ManagePartnersClient from './ManagePartnersClient';
import prisma from '@/libs/prismadb';

const ManagePartnersPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <NullData title='Access denied' />;
  }

  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className='pt-8'>
      <Container>
        <ManagePartnersClient partners={partners as any} />
      </Container>
    </div>
  );
};

export default ManagePartnersPage;
