import Container from '../components/Container';
import Link from 'next/link';

const faqs = [
  {
    q: 'Are your dresses really made in Ghana?',
    a: 'Yes — every piece on Dash Fashion Ghana is crafted locally by Ghanaian artisans and designers. We work with skilled tailors and fabric specialists across Accra and beyond to bring you authentic, high-quality garments.',
  },
  {
    q: 'How do I place an order?',
    a: null,
    steps: [
      'Browse and select your desired dress or item.',
      'Choose your size and click "Add to Cart".',
      'Go to your cart and click "Checkout".',
      'Fill in your delivery address and choose your payment method.',
      "Confirm your order — you'll receive a confirmation email immediately.",
    ],
  },
  {
    q: 'What payment methods do you accept?',
    a: null,
    items: [
      'Mobile Money (MTN MoMo, Vodafone Cash, AirtelTigo)',
      'Debit / Credit cards (Visa, Mastercard) via Paystack',
      'Cash on Delivery (available in select areas)',
    ],
  },
  {
    q: 'How do I know which size to order?',
    a: "Each product page includes a size guide. We recommend measuring your bust, waist, and hips and comparing them with our size chart before ordering. If you're between sizes, we generally suggest sizing up. Still unsure? Chat with us on WhatsApp and we'll help you find the right fit.",
  },
  {
    q: 'How long does delivery take?',
    a: null,
    items: [
      'Accra & major cities: 1–2 working days',
      'Other regions in Ghana: 2–4 working days',
      'Remote areas: up to 5 working days',
    ],
    note: "You'll receive a notification once your order is on its way.",
  },
  {
    q: 'Can I return or exchange a dress?',
    a: 'Yes, within 7 days of delivery, provided the item is unworn, unwashed, and in its original packaging. Custom-made and sale items are not eligible for returns. See our full',
    returnLink: true,
  },
  {
    q: 'Do you do custom orders or alterations?',
    a: "Yes! We work with talented local tailors who can create custom pieces or adjust sizing. Contact us directly on WhatsApp with your measurements and inspiration, and we'll provide a quote.",
  },
  {
    q: 'How do I contact customer support?',
    a: null,
    contact: true,
  },
];

const FaqPage = () => {
  return (
    <Container>
      <div className='max-w-3xl mx-auto py-12 md:py-20'>
        <h1 className='font-bold text-3xl text-center mb-2'>
          Frequently Asked Questions
        </h1>
        <p className='text-center text-slate-400 text-sm mb-10'>
          Everything you need to know about shopping with us
        </p>

        <div className='flex flex-col gap-6'>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className='border border-slate-100 rounded-2xl p-6 bg-white shadow-sm'
            >
              <h2 className='font-semibold text-slate-800 mb-3 flex items-start gap-2'>
                <span className='w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5'>
                  {i + 1}
                </span>
                {faq.q}
              </h2>
              <div className='text-sm text-slate-500 leading-relaxed pl-8'>
                {faq.a && !faq.returnLink && <p>{faq.a}</p>}
                {faq.returnLink && (
                  <p>
                    {faq.a}{' '}
                    <Link
                      href='/return'
                      className='text-teal-600 hover:underline'
                    >
                      Returns & Exchanges policy
                    </Link>
                    .
                  </p>
                )}
                {faq.steps && (
                  <ol className='flex flex-col gap-2 list-decimal list-inside'>
                    {faq.steps.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                )}
                {faq.items && (
                  <ul className='flex flex-col gap-2'>
                    {faq.items.map((item, j) => (
                      <li key={j} className='flex items-start gap-2'>
                        <span className='w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 flex-shrink-0' />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {faq.note && <p className='mt-2 text-slate-400'>{faq.note}</p>}
                {faq.contact && (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-slate-400 text-xs w-20'>
                        Phone / WA
                      </span>
                      <Link
                        href='tel:+233204497603'
                        className='text-teal-600 hover:underline'
                      >
                        020 449 7603
                      </Link>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-slate-400 text-xs w-20'>
                        Phone / WA
                      </span>
                      <Link
                        href='tel:+233205708827'
                        className='text-teal-600 hover:underline'
                      >
                        020 449 7603
                      </Link>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-slate-400 text-xs w-20'>Email</span>
                      <Link
                        href='mailto:hello@dashfashionghana.com'
                        className='text-teal-600 hover:underline'
                      >
                        hello@dashfashionghana.com
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className='mt-10 bg-stone-800 rounded-2xl p-8 text-center text-white'>
          <h3 className='font-semibold text-lg mb-2'>Still have a question?</h3>
          <p className='text-stone-300 text-sm mb-4'>
            Our team is happy to help — just send us a message.
          </p>
          <Link
            href='/contact'
            className='inline-block bg-amber-400 hover:bg-amber-500 text-stone-900 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors'
          >
            Contact Us
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default FaqPage;
