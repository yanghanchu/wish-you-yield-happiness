import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wish You, Yield Happiness',
  description: 'WY and YYH private love archive'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
