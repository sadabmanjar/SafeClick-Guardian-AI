'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth.service';
import { LoginInput, SignupInput } from '@/features/auth/schemas/auth.schema';
import { toast } from 'sonner';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (data: LoginInput) => Promise<void>;
  signUp: (data: SignupInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to detect if Supabase is using placeholder credentials
const isPlaceholderSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !url || !key || url.includes('placeholder') || key.includes('placeholder');
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync cookie with auth session state for Next.js Edge Middleware route-guarding
  const syncCookie = (sessionActive: boolean) => {
    if (typeof document !== 'undefined') {
      if (sessionActive) {
        document.cookie = `safeclick-session=active; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
      } else {
        document.cookie = "safeclick-session=; path=/; max-age=0; SameSite=Lax;";
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AUTH CONTEXT] Initializing Auth state. isPlaceholder:', isPlaceholderSupabase());
        if (isPlaceholderSupabase()) {
          // Check local storage fallback for mock session
          const stored = localStorage.getItem('safeclick_guardian_session');
          console.log('[AUTH CONTEXT] Stored session retrieved:', stored ? 'FOUND' : 'NOT FOUND');
          if (stored) {
            const parsed = JSON.parse(stored);
            console.log('[AUTH CONTEXT] Stored user loaded:', parsed.user.email);
            setUser(parsed.user);
            syncCookie(true);
          } else {
            setUser(null);
            syncCookie(false);
          }
        } else {
          // Real Supabase session check
          console.log('[AUTH CONTEXT] Checking Supabase session...');
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('[AUTH CONTEXT] Supabase session active:', session.user.email);
            setUser(session.user);
            syncCookie(true);
          } else {
            setUser(null);
            syncCookie(false);
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for authentication changes from Supabase
    if (!isPlaceholderSupabase()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          setUser(session.user);
          syncCookie(true);
        } else {
          setUser(null);
          syncCookie(false);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (data: LoginInput) => {
    try {
      setLoading(true);
      console.log('[AUTH CONTEXT] signIn initiated. Email:', data.email);
      if (isPlaceholderSupabase()) {
        // Mock sign in fallback
        const sessionData = await authService.signInWithPassword(data);
        console.log('[AUTH CONTEXT] Mock auth success. User:', sessionData.user);
        setUser(sessionData.user);
        syncCookie(true);
        console.log('[AUTH CONTEXT] Cookie synchronized. document.cookie:', typeof document !== 'undefined' ? document.cookie : 'N/A');
      } else {
        // Supabase sign in
        console.log('[AUTH CONTEXT] Attempting Supabase Auth...');
        const { data: res, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        console.log('[AUTH CONTEXT] Supabase Auth success. User:', res.user);
        setUser(res.user);
        syncCookie(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignupInput) => {
    try {
      setLoading(true);
      if (isPlaceholderSupabase()) {
        // Mock sign up fallback
        await authService.signUp(data);
      } else {
        // Supabase sign up
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              fullName: data.fullName,
            }
          }
        });
        if (error) throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      if (isPlaceholderSupabase()) {
        localStorage.removeItem('safeclick_guardian_session');
      } else {
        await supabase.auth.signOut();
      }
      setUser(null);
      syncCookie(false);
      toast.success('Successfully logged out from terminal session');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
