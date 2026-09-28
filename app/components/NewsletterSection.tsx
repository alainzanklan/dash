'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast.success("You're on the list!");
      setEmail('');
      setSubscribed(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='bg-stone-950 rounded-2xl px-6 py-14 sm:px-10 md:px-16 md:py-20 my-14'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center'>
        {/* Copy */}
        <div>
          <span className='block h-px w-10 bg-amber-400 mb-6' />
          <h2 className='font-serif text-3xl sm:text-4xl md:text-5xl text-stone-50 leading-[1.1] tracking-tight mb-4'>
            Be the first to
            <br />
            see what&apos;s new.
          </h2>
          <p className='text-stone-400 text-sm md:text-base leading-relaxed max-w-sm'>
            New collections, private sales, and styling notes from our
            designers, delivered to your inbox.
          </p>
        </div>

        {/* Form / confirmation */}
        <div className='w-full max-w-md md:justify-self-end'>
          {subscribed ? (
            <div className='border-l-2 border-amber-400 pl-5 py-1'>
              <p className='font-serif text-2xl text-stone-50 mb-1'>
                Thank you.
              </p>
              <p className='text-stone-400 text-sm'>
                You&apos;re on the list. Watch your inbox for our next
                collection.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              <div>
                <label htmlFor='newsletter-email' className='sr-only'>
                  Email address
                </label>
                <input
                  id='newsletter-email'
                  type='email'
                  required
                  placeholder='Your email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className='w-full bg-transparent border-0 border-b border-stone-600 focus:border-amber-400 focus:ring-0 focus:outline-none text-stone-50 placeholder:text-stone-500 text-base py-3 px-0 transition-colors disabled:opacity-60'
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='self-start bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 transition-colors disabled:opacity-60 rounded-full'
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>

              <p className='text-stone-500 text-xs'>
                By subscribing you agree to receive marketing emails.
                Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
