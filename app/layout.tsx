import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '엑스플로디 - 창업을 꿈꾸는 디자이너를 위한 리소스 키트',
  description: '아이디어부터 결과까지, 창업을 꿈꾸는 디자이너를 위한 실무 리소스를 발견하세요.',
  keywords: ['XploreD', '엑스플로디', 'xplored', '디자인', '리소스', '디자인 시스템', '레퍼런스', '플랫폼', 'UI', 'UX', '웹디자인', '프론트엔드'],
  openGraph: {
    title: '엑스플로디 - 창업을 꿈꾸는 디자이너를 위한 리소스 키트',
    description: '아이디어부터 결과까지, 창업을 꿈꾸는 디자이너를 위한 실무 리소스를 발견하세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'XploreD (엑스플로디)',
  },
  twitter: {
    card: 'summary_large_image',
    title: '엑스플로디 - 창업을 꿈꾸는 디자이너를 위한 리소스 키트',
    description: '아이디어부터 결과까지, 창업을 꿈꾸는 디자이너를 위한 실무 리소스를 발견하세요.',
  },
  other: {
    'naver-site-verification': 'verification_token', // Placeholder for actual token
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
