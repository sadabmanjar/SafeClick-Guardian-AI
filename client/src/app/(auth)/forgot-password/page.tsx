import React from 'react';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative neon glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Cyber Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f25_1px,transparent_1px),linear-gradient(to_bottom,#080f25_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full flex justify-center">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
