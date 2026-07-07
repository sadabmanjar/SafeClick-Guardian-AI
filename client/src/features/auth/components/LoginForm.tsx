'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { loginSchema, LoginInput } from '../schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Show auth errors passed via URL query param (e.g., expired session)
  const urlError = searchParams.get('error');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.signInWithPassword(data);
      toast.success('Logged in successfully!');
      const redirectTo = searchParams.get('redirectTo') || '/analyze';
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setAuthError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,102,255,0.15)] space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Welcome Back Guard
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter credentials to authorize secure console access
        </p>
      </div>

      {/* URL-based error (e.g., session expired, auth callback failed) */}
      {urlError && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>
            {urlError === 'auth_callback_failed'
              ? 'Email verification failed. Please try again.'
              : urlError === 'missing_code'
              ? 'Invalid verification link. Please request a new one.'
              : 'Session expired. Please log in again.'}
          </span>
        </div>
      )}

      {/* Inline auth error */}
      {authError && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-foreground">
            Security Email
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-xs font-semibold text-foreground">
              Passkey
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-semibold text-primary hover:underline transition-colors"
            >
              Forgot secret?
            </Link>
          </div>
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

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-black text-primary focus:ring-primary/25 focus:ring-offset-black"
            {...register('rememberMe')}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe" className="text-xs text-muted-foreground cursor-pointer select-none">
            Keep this terminal session active
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(0,102,255,0.4)] rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all pt-0 pb-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Authorizing...
            </>
          ) : (
            <>
              Decrypt Key &amp; Login <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have a secure token?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline transition-colors">
            Generate one here
          </Link>
        </p>
      </div>
    </div>
  );
}
