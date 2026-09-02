import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';
import { ConciergeDrawer } from '@/components/concierge/ConciergeDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { LenisProvider } from '@/components/motion/LenisProvider';
import { PagePreloader } from '@/components/motion/PagePreloader';
import { PageTransitionCurtain } from '@/components/motion/PageTransitionCurtain';
import { ConciergeFloatingPill } from '@/components/layout/ConciergeFloatingPill';
import { FeatureTourModal } from '@/components/tour/FeatureTourModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'nexCommerce — Modern Shopping & Personal Style',
  description: 'Shop quality clothing, footwear, and accessories with personal styling and fast delivery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] bg-fixed text-[#F8FAFF] antialiased">
        <PagePreloader />
        <LenisProvider />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MiniCartDrawer />
        <ConciergeDrawer />
        <ConciergeFloatingPill />
        <FeatureTourModal />
        <SearchOverlay />
        <PageTransitionCurtain />
      </body>
    </html>
  );
}
