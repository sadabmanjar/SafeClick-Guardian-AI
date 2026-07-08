'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase, Profile, UserRole } from '@/lib/supabase';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch profile from `profiles` table by user ID.
   * Role is ALWAYS read from the database — never derived from email.
   */
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[AuthProvider] Profile fetch error:', error.message);
      return null;
    }

    return data as Profile;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const fetchedProfile = await fetchProfile(user.id);
    setProfile(fetchedProfile);
  }, [user, fetchProfile]);

  // Initialize auth state from Supabase session (handles page refreshes)
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const fetchedProfile = await fetchProfile(currentSession.user.id);
          setProfile(fetchedProfile);
        }
      } catch (err) {
        console.error('[AuthProvider] Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const fetchedProfile = await fetchProfile(newSession.user.id);
          setProfile(fetchedProfile);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        // Supabase will send verification email to this address
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw mapAuthError(error);
    }

    // Insert profile row (role defaults to 'citizen' via Supabase DB default)
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: 'citizen',
      });

      if (profileError) {
        console.error('[AuthProvider] Profile creation error:', profileError.message);
      }
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw mapAuthError(error);
    }
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    router.push('/login');
  };

  const resetPassword = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw mapAuthError(error);
    }
  };

  const isEmailVerified = !!user?.email_confirmed_at;
  const isAuthenticated = !!session && !!user;
  const role = (profile?.role as UserRole) ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isAuthenticated,
        isLoading,
        isEmailVerified,
        signUp,
        signIn,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export const useAuth = useAuthContext;


/**
 * Maps Supabase AuthError codes to user-friendly messages.
 */
function mapAuthError(error: AuthError): Error {
  const code = error.message?.toLowerCase() || '';

  if (code.includes('invalid login credentials') || code.includes('invalid password')) {
    return new Error('Incorrect email or password. Please try again.');
  }
  if (code.includes('email not confirmed')) {
    return new Error('Your email is not verified yet. Please check your inbox and verify first.');
  }
  if (code.includes('user already registered')) {
    return new Error('An account with this email already exists. Please log in instead.');
  }
  if (code.includes('password should be at least')) {
    return new Error('Password must be at least 6 characters long.');
  }
  if (code.includes('rate limit')) {
    return new Error('Too many attempts. Please wait a moment before trying again.');
  }
  if (code.includes('network') || code.includes('fetch')) {
    return new Error('Network error. Please check your connection and try again.');
  }
  if (code.includes('expired') || code.includes('token')) {
    return new Error('Your session has expired. Please log in again.');
  }

  return new Error(error.message || 'An unexpected error occurred. Please try again.');
}

