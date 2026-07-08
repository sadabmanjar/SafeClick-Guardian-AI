
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {

  title: 'SafeClick Guardian AI — Indian Cyber Fraud Detection',
  description:
    'AI-powered scam detection and cybersecurity protection platform for Indian citizens. Analyze URLs, SMS, emails and QR codes for fraud risk.',
  keywords: ['scam detection', 'cybersecurity', 'India', 'AI', 'fraud prevention', 'SafeClick'],

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
