'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, MailCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

/**
 * Email Verification Screen
 * Shown after signup to inform users to check their inbox.
 * Provides a resend verification email option.
 *
 * Note: Supabase handles email verification via email links — not 6-digit OTPs.
 * When the user clicks the email link, they are redirected to /auth/callback
 * which exchanges the code for a real session.
 */
export default function OTPVerificationForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [resentCount, setResentCount] = useState(0);

  const handleResendVerification = async () => {
    if (!emailParam) {
      toast.error('Email address not found. Please sign up again.');
      return;
    }

    if (resentCount >= 3) {
      toast.error('Maximum resend attempts reached. Please wait before trying again.');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailParam,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to resend verification email.');
        return;
      }

      setResentCount((prev) => prev + 1);
      toast.success('Verification email resent! Check your inbox.');
    } catch {
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,102,255,0.15)] space-y-6 text-center">
      <div className="space-y-3">
        <div className="mx-auto w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <ShieldCheck size={26} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Verify Your Email
        </h2>
        <p className="text-xs text-muted-foreground px-2 leading-relaxed">
          A secure verification link was sent to{' '}
          {emailParam ? (
            <span className="text-foreground font-semibold">{emailParam}</span>
          ) : (
            'your email address'
          )}
          . Click the link to activate your account.
        </p>
      </div>

      {/* Steps */}
      <div className="p-3 rounded-xl bg-zinc-900 border border-border text-xs text-muted-foreground space-y-2 text-left">
        <p className="font-semibold text-foreground">Complete Verification:</p>
        <div className="space-y-1.5 pl-1">
          <p className="flex items-center gap-2">
            <MailCheck size={12} className="text-primary shrink-0" />
            Open the email from SafeClick
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-primary shrink-0" />
            Click the <span className="text-primary font-bold mx-0.5">Confirm Email</span> button
          </p>
          <p className="flex items-center gap-2">
            <ArrowRight size={12} className="text-primary shrink-0" />
            You will be redirected to your dashboard
          </p>
        </div>
      </div>

      {/* Resend Option */}
      {emailParam && (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">
            Did not receive the email? Check spam, or:
          </p>
          <Button
            onClick={handleResendVerification}
            disabled={isResending || resentCount >= 3}
            variant="outline"
            className="w-full h-10 border-border text-xs font-semibold hover:bg-zinc-900 transition-all"
          >
            {isResending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" /> Resending...
              </>
            ) : (
              <>
                <RefreshCw size={14} className="mr-2" />
                Resend Verification Email
                {resentCount > 0 && ` (${resentCount}/3)`}
              </>
            )}
          </Button>
        </div>
      )}

      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
      >
        Back to Login <ArrowRight size={12} />
      </Link>
    </div>
  );
}
