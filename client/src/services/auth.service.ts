/**
 * Auth Service
 * Wraps Supabase auth calls and the backend's /api/auth/status health check.
 *
 * Authentication is Supabase-managed — no JWT generation happens in Express.
 * This service also provides getAccessToken() for injecting Bearer tokens
 * into Axios requests via the apiClient interceptor.
 */

import { supabase } from '@/lib/supabase';
import { LoginInput, SignupInput, ForgotPasswordInput } from '@/features/auth/schemas/auth.schema';

export const authService = {
  /**
   * Sign up a new user via Supabase.
   * Inserts a profile row with default role = 'citizen'.
   * Supabase sends a real email verification link.
   */
  async signUp(data: SignupInput): Promise<{ message: string; email: string }> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw new Error(mapSupabaseError(error.message));

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        role: 'citizen',
      });
      if (profileError) {
        console.error('[authService.signUp] Profile insert error:', profileError.message);
      }
    }

    return {
      message: 'Account created! A verification email has been sent to your inbox.',
      email: data.email,
    };
  },

  /**
   * Sign in via Supabase with email + password.
   * The resulting Supabase session provides the access_token for API calls.
   */
  async signInWithPassword(data: LoginInput): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error(mapSupabaseError(error.message));
  },

  /**
   * Sign out the current Supabase session.
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(mapSupabaseError(error.message));
  },

  /**
   * Returns the current Supabase session object.
   * Used by apiClient interceptor to attach the Bearer token.
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(mapSupabaseError(error.message));
    return session;
  },

  /**
   * Returns the raw Supabase access token for direct use.
   */
  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.access_token ?? null;
  },

  /**
   * Sends a real Supabase password reset email.
   */
  async resetPasswordForEmail(data: ForgotPasswordInput): Promise<{ message: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw new Error(mapSupabaseError(error.message));
    return { message: 'Password reset link has been sent to your email address.' };
  },
};

// ── Error mapper ─────────────────────────────────────────────────────────────

function mapSupabaseError(message: string): string {
  const m = message?.toLowerCase() || '';

  if (m.includes('invalid login credentials') || m.includes('invalid password')) {
    return 'Incorrect email or password. Please verify your credentials.';
  }
  if (m.includes('email not confirmed')) {
    return 'Your email has not been verified. Please check your inbox for the verification link.';
  }
  if (m.includes('user already registered')) {
    return 'An account with this email already exists. Please log in instead.';
  }
  if (m.includes('rate limit')) {
    return 'Too many login attempts. Please wait a few minutes before trying again.';
  }
  if (m.includes('network') || m.includes('fetch failed')) {
    return 'Network error. Please check your internet connection.';
  }
  if (m.includes('expired') || m.includes('invalid token')) {
    return 'Your session has expired. Please log in again.';
  }
  if (m.includes('password should be')) {
    return 'Password must be at least 6 characters long.';
  }

  return message || 'An unexpected error occurred. Please try again.';
}