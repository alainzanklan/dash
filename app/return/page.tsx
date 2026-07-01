import Container from '../components/Container';

const ReturnsPage = () => {
  return (
    <Container>
      <div className='max-w-3xl mx-auto py-12 md:py-20'>
        <h1 className='font-bold text-3xl text-center mb-2'>
          Returns & Exchanges
        </h1>
        <p className='text-center text-slate-400 text-sm mb-10'>
          Last updated: July 1, 2026
        </p>

        <div className='flex flex-col gap-8 text-slate-600 text-sm leading-relaxed'>
          <p>
            At Dash, every piece is crafted with care and pride. If something
            isn't right with your order, we're here to make it right. Please
            read our returns policy below.
          </p>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Return Window
            </h2>
            <p>
              You may return or exchange eligible items within{' '}
              <strong>7 days</strong> of receiving your order. After 7 days, we
              are unable to accept returns.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Eligible Items for Return
            </h2>
            <p className='mb-3'>
              To qualify for a return, your item must meet the following
              conditions:
            </p>
            <ul className='flex flex-col gap-2 pl-4'>
              {[
                'Purchased within the last 7 days',
                'Unworn, unwashed, and unaltered',
                'In its original packaging with all tags attached',
                'Accompanied by proof of purchase (order confirmation)',
              ].map((item) => (
                <li key={item} className='flex items-start gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 flex-shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Non-Returnable Items
            </h2>
            <p className='mb-3'>The following items cannot be returned:</p>
            <ul className='flex flex-col gap-2 pl-4'>
              {[
                'Custom-made or personalised dresses',
                'Sale or discounted items',
                'Items that have been worn, washed, or altered',
                'Items returned after the 7-day window',
              ].map((item) => (
                <li key={item} className='flex items-start gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 flex-shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Exchanges
            </h2>
            <p>
              We're happy to exchange your item for a different size or colour
              where available. Simply contact us within 7 days and we'll arrange
              the swap. If the replacement item is a different price, you'll be
              charged or refunded the difference.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              How to Return
            </h2>
            <ol className='flex flex-col gap-3 pl-4 list-decimal list-inside'>
              <li>
                Contact us via email or WhatsApp with your order number and
                reason for return.
              </li>
              <li>
                We'll confirm whether your item is eligible and provide return
                instructions.
              </li>
              <li>
                Ship the item to our address:{' '}
                <strong>Achimota Kingsby, Accra Ghana</strong>.
              </li>
              <li>
                Once received and inspected, we'll process your refund or
                exchange within 3–5 business days.
              </li>
            </ol>
            <p className='mt-3'>
              Please note: return shipping costs are the responsibility of the
              customer. We recommend using a trackable delivery service.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Refunds
            </h2>
            <p>
              Approved refunds will be processed using the same payment method
              used for the original purchase. Please allow up to 7 business days
              for the amount to reflect in your account.
            </p>
          </section>

          <section className='bg-stone-50 rounded-2xl p-6'>
            <h2 className='text-lg font-semibold text-slate-800 mb-2'>
              Questions?
            </h2>
            <p className='mb-2'>
              We're always happy to help. Reach out to our team:
            </p>
            <div className='flex flex-col gap-1'>
              <a
                href='mailto:hello@dashfashionghana.com'
                className='text-teal-600 hover:underline font-medium'
              >
                hello@dashfashionghana.com
              </a>
              <a
                href='https://wa.me/233204497603'
                className='text-teal-600 hover:underline font-medium'
              >
                WhatsApp: 0204 497 603
              </a>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default ReturnsPage;
