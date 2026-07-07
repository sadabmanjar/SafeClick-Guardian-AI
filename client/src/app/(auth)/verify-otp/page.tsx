import React, { Suspense } from 'react';
import OTPVerificationForm from '@/features/auth/components/OTPVerificationForm';
import { Loader2 } from 'lucide-react';

export default function VerifyOTPPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative neon glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Cyber Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f25_1px,transparent_1px),linear-gradient(to_bottom,#080f25_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={
          <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
            <p className="text-xs text-muted-foreground mt-4">Loading authorization gateway...</p>
          </div>
        }>
          <OTPVerificationForm />
        </Suspense>
      </div>
    </main>
  );
}
