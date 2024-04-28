import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { UIProvider } from '@yamada-ui/react';
import { Header } from '@/components/layouts/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'カコリンゴ',
  description: 'カコリンゴ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UIProvider>
          <Header />
          <main>{children}</main>
        </UIProvider>
      </body>
    </html>
  );
}
