'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.password });

      if (error) {
        toast.error(error.message || 'Password reset failed. Please try again.');
        return;
      }

      setIsDone(true);
      toast.success('Password updated successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,102,255,0.15)] space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
          <Lock size={22} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Set New Password
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter and confirm your new secure password
        </p>
      </div>

      {isDone ? (
        <div className="p-4 bg-success/15 border border-success/35 text-success rounded-xl text-center space-y-3">
          <CheckCircle2 className="mx-auto" size={28} />
          <p className="text-sm font-semibold">Password updated successfully!</p>
          <p className="text-xs">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-foreground">
              New Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className={`w-full h-11 pl-10 pr-10 rounded-xl bg-black border ${
                  errors.password ? 'border-danger focus:ring-danger/25' : 'border-border focus:border-primary/50'
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all placeholder:text-zinc-700`}
                {...register('password')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
                <ShieldAlert size={12} /> {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••••••"
                className={`w-full h-11 pl-10 pr-10 rounded-xl bg-black border ${
                  errors.confirmPassword ? 'border-danger focus:ring-danger/25' : 'border-border focus:border-primary/50'
                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all placeholder:text-zinc-700`}
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
                <ShieldAlert size={12} /> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(0,102,255,0.4)] rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all pt-0 pb-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Updating...
              </>
            ) : (
              <>
                Update Password <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
