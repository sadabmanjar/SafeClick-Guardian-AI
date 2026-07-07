'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { loginSchema, LoginInput } from '../schemas/auth.schema';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      await signIn(data);
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[LOGIN ERROR] Auth failed:', err);
      toast.error(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-6 text-gray-900">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Sign In
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Enter credentials to authorize secure console access
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-gray-700">
            Security Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              placeholder="admin@safeclick.gov"
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-xs font-bold text-gray-700">
              Passkey
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold text-blue-600 hover:underline transition-colors"
            >
              Forgot secret?
            </Link>
          </div>
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
          {errors.password && (
            <p className="text-[11px] text-red-600 flex items-center gap-1.5 mt-1 font-mono">
              <ShieldAlert size={12} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me Option */}
        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/25 cursor-pointer"
            {...register('rememberMe')}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe" className="text-xs text-gray-500 cursor-pointer select-none font-semibold">
            Keep this terminal session active
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all pt-0 pb-0 shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Authorizing...
            </>
          ) : (
            <>
              Authorize Access <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 font-semibold">
          Don't have a secure token?{' '}
          <Link href="/signup" className="font-bold text-blue-600 hover:underline transition-colors">
            Generate one here
          </Link>
        </p>
      </div>
    </div>
  );
}
