import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XploreD - Curated Design Resources',
  description: 'Discover curated design resources including design systems, references, and platforms for designers and developers.',
  keywords: ['design', 'resources', 'design system', 'references', 'platforms', 'UI', 'UX'],
  openGraph: {
    title: 'XploreD - Curated Design Resources',
    description: 'Discover curated design resources including design systems, references, and platforms.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
