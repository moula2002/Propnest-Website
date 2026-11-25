import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
import { AuthProvider } from '@/context/AuthContext';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { SubpageBackground } from '@/components/common/SubpageBackground';

export const metadata: Metadata = {
  title: 'PropNest — Find, Buy, Rent Verified Properties in India',
  description:
    'Discover premium apartments, independent villas, commercial spaces, and rental flats across top cities with zero brokerage options and direct owner contacts.',
  keywords: [
    'real estate India',
    'buy flats',
    'rent apartments',
    'houses for sale',
    'commercial properties',
    'Bengaluru real estate',
  ],
  authors: [{ name: 'PropNest Real Estate' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'PropNest — Modern Real Estate Portal',
    description: 'Find verified properties for sale and rent across India.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${plusJakarta.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-full bg-[#F8F7F4] text-[#142C4C] antialiased selection:bg-[#FF7A1A] selection:text-white">
        <AuthProvider>
          <SmoothScrollProvider>
            <SubpageBackground />
            <Header />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

