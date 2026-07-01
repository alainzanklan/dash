import Container from '../components/Container';

const PrivacyPolicyPage = () => {
  return (
    <Container>
      <div className='max-w-3xl mx-auto py-12 md:py-20'>
        <h1 className='font-bold text-3xl text-center mb-2'>Privacy Policy</h1>
        <p className='text-center text-slate-400 text-sm mb-10'>
          Last updated: July 1, 2026
        </p>

        <div className='flex flex-col gap-8 text-slate-600 text-sm leading-relaxed'>
          <p>
            This Privacy Policy describes how Dash Fashion Ghana ("we", "us",
            "our") collects, uses, and protects your personal information when
            you shop with us. By using our platform, you agree to the terms of
            this policy.
          </p>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Information We Collect
            </h2>
            <p className='mb-3'>
              When you create an account, place an order, or contact us, we may
              collect:
            </p>
            <ul className='flex flex-col gap-2 pl-4'>
              {[
                'Full name and email address',
                'Phone number',
                'Delivery address (city, region, street)',
                'Payment reference information',
                'Browsing and order history on our platform',
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
              How We Use Your Information
            </h2>
            <ul className='flex flex-col gap-2 pl-4'>
              {[
                'To process and fulfill your orders',
                'To send order confirmations and delivery updates',
                'To respond to your enquiries and support requests',
                'To improve our website and product offerings',
                'To send you promotions and new collection alerts (you may opt out at any time)',
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
              Cookies
            </h2>
            <p>
              We use cookies to keep your cart active, remember your login, and
              understand how visitors use our site. You can disable cookies in
              your browser settings, though some features may not work as
              expected.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Third-Party Services
            </h2>
            <p>
              We use trusted third-party services to process payments (Paystack)
              and send emails (Resend). These providers have their own privacy
              policies and handle your data securely. We do not sell your
              personal information to any third party.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Data Retention
            </h2>
            <p>
              We retain your personal data only for as long as necessary to
              fulfil the purposes outlined in this policy, or as required by
              law. You may request deletion of your account and associated data
              at any time.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Your Rights
            </h2>
            <p className='mb-3'>You have the right to:</p>
            <ul className='flex flex-col gap-2 pl-4'>
              {[
                'Access the personal data we hold about you',
                'Request correction of inaccurate information',
                'Request deletion of your personal data',
                'Opt out of marketing communications',
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
              Children's Privacy
            </h2>
            <p>
              Our platform is not intended for children under 13. We do not
              knowingly collect data from minors. If you believe a child has
              provided us with personal information, please contact us
              immediately.
            </p>
          </section>

          <section>
            <h2 className='text-lg font-semibold text-slate-800 mb-3'>
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes via email or a notice on our
              website. Continued use of our platform after changes constitutes
              your acceptance.
            </p>
          </section>

          <section className='bg-stone-50 rounded-2xl p-6'>
            <h2 className='text-lg font-semibold text-slate-800 mb-2'>
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, reach us at:
            </p>
            <a
              href='mailto:hello@dashfashionghana.com'
              className='text-teal-600 hover:underline font-medium mt-1 inline-block'
            >
              hello@dashfashionghana.com
            </a>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default PrivacyPolicyPage;
