'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, AlertCircle, Shield, Fingerprint, Cpu } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { loginSchema, LoginInput } from '../schemas/auth.schema';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
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
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setAuthError(null);
    try {

      await signIn(data.email, data.password);
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
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Secure Portal</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
        <p className="text-xs text-white/30 font-medium">Sign in to access the guardian console</p>
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
          <label htmlFor="email" className="block text-xs font-bold text-white/50 uppercase tracking-wider">
            Security Email
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              id="email"
              type="email"
              placeholder="admin@safeclick.gov"
              className={`w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.04] border ${
                errors.email
                  ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10'
                  : 'border-white/8 focus:border-cyan-500/50 focus:ring-cyan-500/10'
              } text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-white/15 font-medium text-white`}
              style={{ borderColor: errors.email ? undefined : 'rgba(255,255,255,0.08)' }}
              {...register('email')}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-400 flex items-center gap-1.5 mt-1">
              <ShieldAlert size={11} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-xs font-bold text-white/50 uppercase tracking-wider">
              Passkey
            </label>
            <Link href="/forgot-password" className="text-[10px] font-bold text-cyan-400/70 hover:text-cyan-300 transition-colors">
              Forgot passkey?
            </Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full h-12 pl-10 pr-10 rounded-xl bg-white/[0.04] border ${
                errors.password
                  ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10'
                  : 'border-white/8 focus:border-cyan-500/50 focus:ring-cyan-500/10'
              } text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-white/15 font-medium text-white`}
              style={{ borderColor: errors.password ? undefined : 'rgba(255,255,255,0.08)' }}
              {...register('password')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-400 flex items-center gap-1.5 mt-1">
              <ShieldAlert size={11} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}

        <div className="flex items-center gap-2">

          <input
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/20 cursor-pointer"
            {...register('rememberMe')}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe" className="text-xs text-white/30 cursor-pointer select-none font-medium">
            Keep session active
          </label>
        </div>


        <Button
          type="submit"
          className="w-full h-12 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border-0 text-white text-sm"
          style={{
            background: 'linear-gradient(90deg, #0284c7 0%, #06b6d4 100%)',
            boxShadow: '0 4px 24px rgba(6,182,212,0.25)',
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Authorizing...</>
          ) : (

            <>
              Decrypt Key &amp; Login <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>


      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span className="text-[10px] text-white/15 font-medium uppercase tracking-widest">or</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Sign up */}
      <p className="text-xs text-white/25 font-medium text-center">
        No account?{' '}
        <Link href="/signup" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          Register here
        </Link>
      </p>

      {/* Security badges */}
      <div className="flex justify-between pt-2">
        {[
          { icon: Shield, label: '256-bit SSL' },
          { icon: Fingerprint, label: 'Biometric Ready' },
          { icon: Cpu, label: 'AI Monitored' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <Icon size={11} className="text-white/15" />
            <span className="text-[10px] text-white/15 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
