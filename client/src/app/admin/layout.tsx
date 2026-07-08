import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'SafeClick Guardian AI Admin Console',
  description: 'Administration and Management Console for SafeClick Guardian AI.',
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      {children}
    </div>
  );
}
