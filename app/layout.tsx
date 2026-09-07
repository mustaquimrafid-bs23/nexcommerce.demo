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
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
import { ComparisonModal } from '@/components/modals/ComparisonModal';
import { BudgetCartModal } from '@/components/cart/BudgetCartModal';

import { OrganizationSchema } from '@/components/seo/OrganizationSchema';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'nexCommerce — Modern Shopping & Personal Style',
    template: '%s | nexCommerce',
  },
  description: 'Curated luxury apparel, architectural tailoring, and personal style intelligence with fast express delivery.',
  keywords: [
    'luxury apparel',
    'modern wardrobe',
    'minimalist tailoring',
    'cashmere knitwear',
    'personal styling',
    'nexCommerce',
  ],
  authors: [{ name: 'nexCommerce Editorial' }],
  creator: 'nexCommerce',
  publisher: 'nexCommerce',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'nexCommerce — Modern Shopping & Personal Style',
    description: 'Curated luxury apparel, architectural tailoring, and personal style intelligence.',
    url: siteUrl,
    siteName: 'nexCommerce',
    images: [
      {
        url: '/assets/images/lifestyle/Gemini_Generated_Image_c36exc36exc36exc.jpg',
        width: 1200,
        height: 630,
        alt: 'nexCommerce Autumn / Winter Collection — Form in Motion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nexCommerce — Modern Shopping & Personal Style',
    description: 'Curated luxury apparel, architectural tailoring, and personal style intelligence.',
    images: ['/assets/images/lifestyle/Gemini_Generated_Image_c36exc36exc36exc.jpg'],
    creator: '@nexcommerce',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] bg-fixed text-[#F8FAFF] antialiased">
        <OrganizationSchema />
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
        <CookieConsentBanner />
        <ComparisonModal />
        <BudgetCartModal />
        <PageTransitionCurtain />
      </body>
    </html>
  );
}
