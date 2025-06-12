import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionSyncer from '@/components/auth/SessionSyncer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkLens',
  description: 'The AI-native bookmark manager that automatically summarizes, clusters, and quality-checks your saved links.',
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionSyncer />
        {children}
      </body>
    </html>
  );
}