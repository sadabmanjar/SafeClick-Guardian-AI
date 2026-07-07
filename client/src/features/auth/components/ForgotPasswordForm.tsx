'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ShieldAlert, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { forgotPasswordSchema, ForgotPasswordInput } from '../schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await authService.resetPasswordForEmail(data);
      toast.success('Passkey recovery token dispatched!');
      setIsSent(true);
    } catch (err: any) {
      toast.error(err.message || 'Passkey recovery request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,102,255,0.15)] space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
          <KeyRound size={22} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Passkey Decryption Recover
        </h2>
        <p className="text-xs text-muted-foreground px-2">
          Submit your registered contact address to receive the decryption keys reset token
        </p>
      </div>

      {isSent ? (
        <div className="p-4 bg-success/15 border border-success/35 text-success rounded-xl text-center text-xs space-y-4">
          <p>
            An authorized recovery link has been dispatched to your email address. Follow the instructions to override keys.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
            >
              Return to Login Portal <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-foreground">
              Contact Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="e.g. agent@safeclick.gov"
                className={`w-full h-11 pl-10 pr-4 rounded-xl bg-black border ${
                  errors.email ? 'border-danger focus:ring-danger/25' : 'border-border focus:border-primary/50'
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all placeholder:text-zinc-600`}
                {...register('email')}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
                <ShieldAlert size={12} /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(0,102,255,0.4)] rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all pt-0 pb-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Dispatching...
              </>
            ) : (
              <>
                Send Decryption Recovery <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>
      )}

      {!isSent && (
        <div className="text-center pt-2">
          <Link href="/login" className="text-xs font-semibold text-primary hover:underline transition-colors">
            Back to login portal
          </Link>
        </div>
      )}
    </div>
  );
}
