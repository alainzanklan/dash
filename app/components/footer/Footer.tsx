import Link from 'next/link';
import Container from '../Container';
import { AiFillInstagram, AiFillFacebook } from 'react-icons/ai';
import { FaTiktok } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';

const footerLinkClass =
  'text-zinc-400 hover:text-zinc-900 transition-colors duration-200 text-sm';

const socialIconClass =
  'flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 text-zinc-500 hover:text-white hover:bg-zinc-900 hover:border-zinc-900 transition-all duration-200';

const Footer = () => {
  return (
    <footer className='bg-zinc-50 border-t border-zinc-100 mt-20'>
      <Container>
        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8'>
            {/* Brand */}
            <div className='md:col-span-5 flex flex-col gap-4'>
              <h2 className='text-2xl font-semibold tracking-tight text-zinc-900'>
                Dash
              </h2>
              <p className='text-sm text-zinc-500 leading-relaxed max-w-sm'>
                Founded in 2014, Dash Fashion Ghana is a contemporary womenswear
                brand based in Accra, Ghana — owned and managed by its founder,
                Diana Adorboi.
              </p>

              <div className='flex items-start gap-2 text-sm text-zinc-500 mt-1'>
                <MdLocationOn
                  size={18}
                  className='text-zinc-400 flex-shrink-0 mt-0.5'
                />
                <span>Showroom at Achimota Kingsby, Accra, Ghana</span>
              </div>

              {/* Socials */}
              <div className='flex gap-2.5 mt-2'>
                <Link
                  href='https://tiktok.com/@emartgh'
                  aria-label='TikTok'
                  className={socialIconClass}
                >
                  <FaTiktok size={16} />
                </Link>
                <Link
                  href='https://instagram.com/emartghana'
                  aria-label='Instagram'
                  className={socialIconClass}
                >
                  <AiFillInstagram size={18} />
                </Link>
                <Link
                  href='https://facebook.com/emartghs'
                  aria-label='Facebook'
                  className={socialIconClass}
                >
                  <AiFillFacebook size={18} />
                </Link>
              </div>
            </div>

            {/* Shop */}
            <div className='md:col-span-2 flex flex-col gap-3'>
              <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1'>
                Shop
              </h3>
              <Link href='/?category=milestones' className={footerLinkClass}>
                Milestones
              </Link>
              <Link href='/?category=social-events' className={footerLinkClass}>
                Social Events
              </Link>
              <Link href='/?category=casuals' className={footerLinkClass}>
                Casuals
              </Link>
              <Link href='/?category=corporates' className={footerLinkClass}>
                Corporates
              </Link>
              <Link
                href='/?category=daily-accessories'
                className={footerLinkClass}
              >
                Accessories
              </Link>
            </div>

            {/* Customer Service */}
            <div className='md:col-span-3 flex flex-col gap-3'>
              <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1'>
                Customer Service
              </h3>
              <Link href='/contact' className={footerLinkClass}>
                Contact Us
              </Link>
              <Link href='/privacy' className={footerLinkClass}>
                Privacy Policy
              </Link>
              <Link href='/return' className={footerLinkClass}>
                Returns & Exchanges
              </Link>
              <Link href='/faq' className={footerLinkClass}>
                FAQ
              </Link>
            </div>

            {/* Contact */}
            <div className='md:col-span-2 flex flex-col gap-3'>
              <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1'>
                Get in Touch
              </h3>
              <a
                href='mailto:hello@dashfashion.com'
                className='flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors'
              >
                <MdEmail size={16} className='text-zinc-400' />
                hello@dashfashionghana.com
              </a>
              <a
                href='tel:+233240000000'
                className='flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors'
              >
                <MdPhone size={16} className='text-zinc-400' />
                +233 20 449 7603
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-zinc-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-3'>
          <p className='text-xs text-zinc-400'>
            &copy; {new Date().getFullYear()} Dash Fashion Ghana. All rights
            reserved.
          </p>
          <p className='text-xs text-zinc-400'>Developed by Webcom</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
