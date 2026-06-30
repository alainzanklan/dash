import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import NavBar from './components/nav/NavBar';
import Footer from './components/footer/Footer';
import CartProvider from '@/providers/CartProvider';
import AuthProvider from '@/providers/AuthProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import { GoogleTagManager } from '@next/third-parties/google';
import FacebookPixel from './components/FacebookPixel';
import FloatingSupport from './components/FloatingSupport';

const vibes = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Dash Fashion Ghana',
  description:
    ' Contemporary womenswear brand based in Accra, Ghana owned and managed by its founder, Diana Adorboi',
  icons: {
    icon: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={`${vibes.className} text-slate-900`}>
        <AuthProvider>
          <Toaster
            toastOptions={{
              style: {
                background: 'rgb(51 65 85)',
                color: '#fff',
              },
            }}
          />
          <CartProvider>
            <div className='flex flex-col min-h-screen'>
              <Suspense>
                <NavBar />
              </Suspense>
              <main className='flex-grow'>{children}</main>

              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
        <FloatingSupport />

        <GoogleTagManager gtmId='AW-16511896891' />
        <FacebookPixel />
      </body>
    </html>
  );
}
