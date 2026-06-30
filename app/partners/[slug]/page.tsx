import prisma from '@/libs/prismadb';
import { notFound } from 'next/navigation';
import Container from '@/app/components/Container';
import ProductCard from '@/app/components/products/ProductCard';
import { MdPhone, MdEmail, MdStore } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

interface PartnerPageProps {
  params: { slug: string };
}

const PartnerPage = async ({ params }: PartnerPageProps) => {
  const partner = await prisma.partner.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      products: {
        where: { inStock: true },
        include: { reviews: true },
      },
    },
  });

  if (!partner) return notFound();

  return (
    <div className='pb-16'>
      {/* Partner header */}
      <div className='bg-white border-b border-slate-100'>
        <Container>
          <div className='py-10 flex flex-col sm:flex-row items-center sm:items-start gap-6'>
            {/* Logo or icon */}
            <div className='w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200'>
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={80}
                  height={80}
                  className='object-contain'
                />
              ) : (
                <MdStore size={36} className='text-slate-400' />
              )}
            </div>

            <div className='flex-1 text-center sm:text-left'>
              <h1 className='text-2xl font-bold text-slate-800'>
                {partner.name}
              </h1>
              {partner.description && (
                <p className='text-slate-500 text-sm mt-1 max-w-xl'>
                  {partner.description}
                </p>
              )}

              {/* Contact info */}
              <div className='flex flex-wrap gap-4 mt-4 justify-center sm:justify-start'>
                {partner.phone && (
                  <a
                    href={`tel:${partner.phone}`}
                    className='flex items-center gap-1.5 text-sm text-slate-600 hover:text-teal-600'
                  >
                    <MdPhone size={16} className='text-teal-500' />
                    {partner.phone}
                  </a>
                )}
                {partner.whatsapp && (
                  <a
                    href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1.5 text-sm text-slate-600 hover:text-green-600'
                  >
                    <FaWhatsapp size={16} className='text-green-500' />
                    WhatsApp
                  </a>
                )}
                {partner.email && (
                  <a
                    href={`mailto:${partner.email}`}
                    className='flex items-center gap-1.5 text-sm text-slate-600 hover:text-teal-600'
                  >
                    <MdEmail size={16} className='text-teal-500' />
                    {partner.email}
                  </a>
                )}
              </div>
            </div>

            {/* Product count badge */}
            <div className='bg-teal-50 rounded-2xl px-5 py-3 text-center flex-shrink-0'>
              <p className='text-2xl font-bold text-teal-600'>
                {partner.products.length}
              </p>
              <p className='text-xs text-teal-500 font-medium'>Products</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Products */}
      <Container>
        <div className='mt-8'>
          <h2 className='text-lg font-semibold text-slate-800 mb-4'>
            Products by {partner.name}
          </h2>
          {partner.products.length === 0 ? (
            <p className='text-slate-400 text-sm'>
              No products available from this partner.
            </p>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-4'>
              {partner.products.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default PartnerPage;
