'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail, Lock, Eye, EyeOff, ShieldAlert,
  ArrowRight, Loader2, User, Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { signupSchema, SignupInput } from '../schemas/auth.schema';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordVal = watch('password', '');

  const requirements = [
    { label: '8+ Chars', met: passwordVal.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(passwordVal) },
    { label: 'Lowercase', met: /[a-z]/.test(passwordVal) },
    { label: 'Number', met: /[0-9]/.test(passwordVal) },
    { label: 'Symbol', met: /[^A-Za-z0-9]/.test(passwordVal) },
  ];

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      await signUp(data);
      toast.success('Registration accepted! Sending OTP code.');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error(err.message || 'Account registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border ${
      hasError
        ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/10'
        : 'border-white/[0.08] focus:border-cyan-500/50 focus:ring-cyan-500/10'
    } text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-white/15 font-medium text-white`;

  const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? (
      <p className="text-[11px] text-red-400 flex items-center gap-1.5 mt-1">
        <ShieldAlert size={11} /> {msg}
      </p>
    ) : null;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Create Account</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Join the network</h1>
        <p className="text-xs text-white/30 font-medium">Provision your credentials to access SafeClick</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs font-bold text-white/50 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Rahul Sharma"
              className={inputClass(!!errors.fullName)}
              {...register('fullName')}
              disabled={isLoading}
            />
          </div>
          <ErrorMsg msg={errors.fullName?.message} />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-white/50 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              id="email"
              type="email"
              placeholder="e.g. rahul@email.com"
              className={inputClass(!!errors.email)}
              {...register('email')}
              disabled={isLoading}
            />
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-bold text-white/50 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={inputClass(!!errors.password) + ' pr-10'}
              {...register('password')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Password requirements */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {requirements.map((req) => (
              <span
                key={req.label}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${
                  req.met
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/20'
                }`}
              >
                {req.met && <Check size={7} />} {req.label}
              </span>
            ))}
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-xs font-bold text-white/50 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={inputClass(!!errors.confirmPassword) + ' pr-10'}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <ErrorMsg msg={errors.confirmPassword?.message} />
        </div>

        {/* Terms checkbox */}
        <div className="space-y-1">
          <div className="flex items-start gap-2.5">
            <input
              id="acceptTerms"
              type="checkbox"
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/20 cursor-pointer mt-0.5 flex-shrink-0"
              {...register('acceptTerms')}
              disabled={isLoading}
            />
            <label htmlFor="acceptTerms" className="text-[11px] text-white/30 cursor-pointer select-none leading-relaxed font-medium">
              I consent to local OCR extraction and zero-knowledge data auditing by the SafeClick Guardian System
            </label>
          </div>
          <ErrorMsg msg={errors.acceptTerms?.message} />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border-0 text-white text-sm"
          style={{
            background: 'linear-gradient(90deg, #0284c7 0%, #06b6d4 100%)',
            boxShadow: '0 4px 24px rgba(6,182,212,0.25)',
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Creating Account...</>
          ) : (
            <>Create Account <ArrowRight size={16} /></>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span className="text-[10px] text-white/15 font-medium uppercase tracking-widest">or</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Login link */}
      <p className="text-xs text-white/25 font-medium text-center">
        Already registered?{' '}
        <Link href="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
