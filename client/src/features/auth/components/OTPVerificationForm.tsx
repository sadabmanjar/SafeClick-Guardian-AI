'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, ShieldAlert, ArrowRight, Loader2, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { otpVerificationSchema, OTPVerificationInput } from '../schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

export default function OTPVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const emailParam = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPVerificationInput>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      email: emailParam,
      otp: '',
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: OTPVerificationInput) => {
    setIsLoading(true);
    try {
      await authService.verifyOtp(data);
      toast.success('Identity authorized successfully!');
      router.push('/analyze');
    } catch (err: any) {
      toast.error(err.message || 'OTP verification failed. Mock code is: 123456');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,102,255,0.15)] space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
          <ShieldCheck size={22} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Secure OTP Verification
        </h2>
        <p className="text-xs text-muted-foreground px-2">
          Verify authorization token sent to your contact address
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-foreground">
            Identity Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              placeholder="e.g. rahul@email.com"
              className={`w-full h-11 pl-10 pr-4 rounded-xl bg-black border ${
                errors.email ? 'border-danger focus:ring-danger/25' : 'border-border focus:border-primary/50'
              } text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all placeholder:text-zinc-600`}
              {...register('email')}
              disabled={isLoading || !!emailParam}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* OTP Code */}
        <div className="space-y-1.5">
          <label htmlFor="otp" className="block text-xs font-semibold text-foreground">
            6-Digit Authorization Code
          </label>
          <div className="relative flex justify-center">
            <input
              id="otp"
              type="text"
              placeholder="123456"
              maxLength={6}
              className={`w-full h-12 text-center text-xl font-bold tracking-[0.6em] rounded-xl bg-black border ${
                errors.otp ? 'border-danger focus:ring-danger/25' : 'border-border focus:border-primary/50'
              } focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all placeholder:text-zinc-800`}
              {...register('otp')}
              disabled={isLoading}
            />
          </div>
          <p className="text-[10px] text-muted-foreground font-mono text-center pt-1">
            Demo Secret Hint: Use mock code <span className="text-primary font-bold">123456</span>
          </p>
          {errors.otp && (
            <p className="text-[11px] text-danger flex items-center justify-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.otp.message}
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
              <Loader2 size={16} className="animate-spin" /> Verifying...
            </>
          ) : (
            <>
              Confirm Code & Authorize <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
