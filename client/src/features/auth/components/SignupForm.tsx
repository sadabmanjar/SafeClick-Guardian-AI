'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, User, Check, AlertCircle, MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { signupSchema, SignupInput } from '../schemas/auth.schema';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupComplete, setSignupComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password', '');

  const requirements = [
    { label: '8+ Characters', met: passwordVal.length >= 8 },
    { label: 'Uppercase Letter', met: /[A-Z]/.test(passwordVal) },
    { label: 'Lowercase Letter', met: /[a-z]/.test(passwordVal) },
    { label: 'Number', met: /[0-9]/.test(passwordVal) },
    { label: 'Special Character', met: /[^A-Za-z0-9]/.test(passwordVal) },
  ];

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.signUp(data);
      setRegisteredEmail(data.email);
      setSignupComplete(true);
      toast.success('Account created! Check your inbox to verify your email.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Account registration failed.';
      setAuthError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state: show email verification prompt
  if (signupComplete) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,102,255,0.15)] space-y-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
          <MailCheck size={26} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Verify Your Email
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed px-2">
            A verification link has been sent to{' '}
            <span className="text-foreground font-semibold">{registeredEmail}</span>.
            Click the link in your email to activate your account.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900 border border-border text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Next Steps:</p>
          <p>1. Open the email from Supabase / SafeClick</p>
          <p>2. Click the <span className="text-primary font-semibold">Confirm Email</span> link</p>
          <p>3. You will be redirected to the dashboard</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
        >
          Back to Login <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-primary/20 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,102,255,0.15)] space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Secure Identity Creation
        </h2>
        <p className="text-xs text-muted-foreground">
          Provision your credentials to connect with SafeClick Shield
        </p>
      </div>

      {authError && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs font-semibold text-foreground">
            Identity Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Rahul Sharma"
              className={`w-full h-11 pl-10 pr-4 rounded-xl bg-black border ${
                errors.fullName ? 'border-danger focus:ring-danger/25' : 'border-border focus:border-primary/50'
              } text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all placeholder:text-zinc-600`}
              {...register('fullName')}
              disabled={isLoading}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.fullName.message}
            </p>
          )}
        </div>

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
              placeholder="e.g. rahul@email.com"
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

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-semibold text-foreground">
            Passkey Crypt (8+ characters)
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

          {/* Password Strength indicators */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {requirements.map((req) => (
              <span
                key={req.label}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${
                  req.met
                    ? 'bg-success/15 border-success/35 text-success'
                    : 'bg-zinc-900 border-border/50 text-muted-foreground'
                }`}
              >
                {req.met && <Check size={8} />} {req.label}
              </span>
            ))}
          </div>

          {errors.password && (
            <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-foreground">
            Confirm Passkey
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-10 pr-10 rounded-xl bg-black border ${
                errors.confirmPassword ? 'border-danger focus:ring-danger/25' : 'border-border focus:border-primary/50'
              } text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all placeholder:text-zinc-700`}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <input
              id="acceptTerms"
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-black text-primary focus:ring-primary/25 focus:ring-offset-black mt-0.5"
              {...register('acceptTerms')}
              disabled={isLoading}
            />
            <label htmlFor="acceptTerms" className="text-xs text-muted-foreground cursor-pointer select-none leading-normal">
              I consent to local OCR extraction and zero-knowledge data auditing
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-[11px] text-danger flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.acceptTerms.message}
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
              <Loader2 size={16} className="animate-spin" /> Provisioning...
            </>
          ) : (
            <>
              Register Identity &amp; Send OTP <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
            Decrypt and sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
