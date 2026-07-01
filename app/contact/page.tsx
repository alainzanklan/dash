'use client';

import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Container from '../components/Container';
import Link from 'next/link';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const inputClass =
  'w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-400 transition bg-white';
const labelClass = 'text-sm font-medium text-slate-600';

const ContactUsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    // Replace with your actual contact form submission logic
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you soon.");
    reset();
    setIsLoading(false);
  };

  return (
    <Container>
      <div className='max-w-5xl mx-auto py-12 md:py-20'>
        <h1 className='font-bold text-3xl text-center mb-2'>Contact Us</h1>
        <p className='text-center text-slate-400 text-sm mb-12'>
          We'd love to hear from you — styling questions, custom orders, or
          anything else.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left — contact info */}
          <div className='flex flex-col gap-5'>
            <div className='bg-stone-800 rounded-2xl p-8 text-white flex-1'>
              <h2 className='font-semibold text-lg mb-1'>Get in Touch</h2>
              <p className='text-stone-300 text-sm mb-8'>
                We're available Monday to Saturday, 9am – 6pm.
              </p>

              <div className='flex flex-col gap-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-stone-700 flex items-center justify-center flex-shrink-0'>
                    <MdLocationOn size={20} className='text-amber-400' />
                  </div>
                  <div>
                    <p className='font-medium text-sm mb-0.5'>Our Showroom</p>
                    <p className='text-stone-300 text-sm'>
                      Achimota Kingsby, Accra Ghana
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-stone-700 flex items-center justify-center flex-shrink-0'>
                    <MdPhone size={20} className='text-amber-400' />
                  </div>
                  <div>
                    <p className='font-medium text-sm mb-1'>Phone</p>
                    <Link
                      href='tel:+233204497603'
                      className='text-stone-300 hover:text-white text-sm block'
                    >
                      0204 497 603
                    </Link>
                    {/* <Link
                      href='tel:+233204497603'
                      className='text-stone-300 hover:text-white text-sm block'
                    >
                      0204 497 603
                    </Link> */}
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-stone-700 flex items-center justify-center flex-shrink-0'>
                    <FaWhatsapp size={20} className='text-amber-400' />
                  </div>
                  <div>
                    <p className='font-medium text-sm mb-1'>WhatsApp</p>
                    <Link
                      href='https://wa.me/233204497603'
                      target='_blank'
                      className='text-stone-300 hover:text-white text-sm'
                    >
                      Chat with us
                    </Link>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-stone-700 flex items-center justify-center flex-shrink-0'>
                    <MdEmail size={20} className='text-amber-400' />
                  </div>
                  <div>
                    <p className='font-medium text-sm mb-1'>Email</p>
                    <Link
                      href='mailto:hello@dashfashionghana.com'
                      className='text-stone-300 hover:text-white text-sm'
                    >
                      hello@dashfashionghana.com
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div className='bg-white border border-slate-100 rounded-2xl p-8 shadow-sm'>
            <h2 className='font-semibold text-slate-800 mb-1'>
              Send a Message
            </h2>
            <p className='text-slate-400 text-sm mb-6'>
              We'll reply within 24 hours.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-4'
            >
              <div className='flex flex-col gap-1'>
                <label className={labelClass}>Full Name *</label>
                <input
                  {...register('name', { required: true })}
                  type='text'
                  placeholder='Your name'
                  className={`${inputClass} ${errors.name ? 'border-rose-400' : ''}`}
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className={labelClass}>Email Address *</label>
                <input
                  {...register('email', { required: true })}
                  type='email'
                  placeholder='your@email.com'
                  className={`${inputClass} ${errors.email ? 'border-rose-400' : ''}`}
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className={labelClass}>Message *</label>
                <textarea
                  {...register('message', { required: true })}
                  rows={5}
                  placeholder='Tell us how we can help — styling advice, custom orders, returns…'
                  className={`${inputClass} resize-none ${errors.message ? 'border-rose-400' : ''}`}
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-stone-800 hover:bg-stone-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl py-3 text-sm transition-colors'
              >
                {isLoading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ContactUsPage;
