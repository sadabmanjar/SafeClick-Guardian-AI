'use client';

import { useAuthContext } from '@/contexts/AuthContext';

/**
 * useAuth - Primary hook for consuming the AuthContext.
 *
 * Provides:
 * - user, session, profile, role
 * - isAuthenticated, isLoading, isEmailVerified
 * - signUp, signIn, signOut, resetPassword, refreshProfile
 *
 * Must be used inside a component wrapped by AuthProvider.
 */
export const useAuth = () => {
  return useAuthContext();
};
