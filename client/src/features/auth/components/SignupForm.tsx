'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2, User, Check } from 'lucide-react';
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
    try {
      await signUp(data);
      toast.success('Registration request accepted! Sending 6-digit OTP code.');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error(err.message || 'Account registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-6 text-gray-900">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Create Account
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Provision your credentials to connect with SafeClick Shield
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs font-bold text-gray-700">
            Identity Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Rahul Sharma"
              className={`w-full h-11 pl-10 pr-4 rounded-xl bg-white border ${
                errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-600'
              } text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400 font-medium text-gray-900`}
              {...register('fullName')}
              disabled={isLoading}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-red-600 flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-gray-700">
            Contact Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              placeholder="e.g. rahul@email.com"
              className={`w-full h-11 pl-10 pr-4 rounded-xl bg-white border ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-600'
              } text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400 font-medium text-gray-900`}
              {...register('email')}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-600 flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-bold text-gray-700">
            Passkey Crypt (8+ characters)
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-10 pr-10 rounded-xl bg-white border ${
                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-600'
              } text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400 font-medium text-gray-900`}
              {...register('password')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          {/* Real-time requirements display */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {requirements.map((req) => (
              <span
                key={req.label}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border transition-all ${
                  req.met
                    ? 'bg-green-50 border-green-200 text-green-700 font-semibold'
                    : 'bg-gray-50 border-gray-200 text-gray-400 font-semibold'
                }`}
              >
                {req.met && <Check size={8} />} {req.label}
              </span>
            ))}
          </div>

          {errors.password && (
            <p className="text-[11px] text-red-600 flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700">
            Confirm Passkey
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full h-11 pl-10 pr-10 rounded-xl bg-white border ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-600'
              } text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400 font-medium text-gray-900`}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-600 flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <input
              id="acceptTerms"
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/25 cursor-pointer mt-0.5"
              {...register('acceptTerms')}
              disabled={isLoading}
            />
            <label htmlFor="acceptTerms" className="text-xs text-gray-500 cursor-pointer select-none leading-normal font-semibold">
              I consent to local OCR extraction and zero-knowledge data auditing
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-[11px] text-red-600 flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all pt-0 pb-0 shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Provisioning...
            </>
          ) : (
            <>
              Register Identity <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 font-semibold">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:underline transition-colors">
            Decrypt and sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
