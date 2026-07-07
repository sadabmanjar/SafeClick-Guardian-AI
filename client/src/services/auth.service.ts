/**
 * Mock Authentication Service simulating Supabase authentication flow.
 * In production, these calls will connect to Supabase auth client endpoints.
 */

import { LoginInput, SignupInput, ForgotPasswordInput, OTPVerificationInput } from '../features/auth/schemas/auth.schema';

export interface UserSession {
  user: {
    id: string;
    email: string;
    fullName?: string;
    role: string;
  } | null;
  session: {
    accessToken: string;
    expiresIn: number;
  } | null;
}

const SESSION_KEY = 'safeclick_guardian_session';

export const authService = {
  /**
   * Helper to fetch current session from local storage
   */
  getCurrentSession(): UserSession | null {
    if (typeof window === 'undefined') return null;
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  /**
   * Simulates login with password
   */
  async signInWithPassword(data: LoginInput): Promise<UserSession> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API latency

    // Check mock credentials
    if (data.email === 'admin@safeclick.gov' && data.password !== 'SafeClick123!') {
      throw new Error('Invalid email or password');
    }

    const mockSession: UserSession = {
      user: {
        id: 'usr_mock_001',
        email: data.email,
        fullName: data.email.split('@')[0],
        role: data.email.includes('admin') || data.email.includes('police') ? 'admin' : 'citizen',
      },
      session: {
        accessToken: 'mock_jwt_token_' + Math.random().toString(36).substr(2),
        expiresIn: 3600,
      },
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(mockSession));
    return mockSession;
  },

  /**
   * Simulates signup flow, redirecting to OTP code verification
   */
  async signUp(data: SignupInput): Promise<{ message: string; email: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API latency

    // If duplicate check (mock check)
    if (data.email === 'existing@safeclick.gov') {
      throw new Error('User already exists');
    }

    return {
      message: 'Signup successful. An OTP code has been sent to your email.',
      email: data.email,
    };
  },

  /**
   * Simulates verification of 6-digit OTP code sent to user email
   */
  async verifyOtp(data: OTPVerificationInput): Promise<UserSession> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API latency

    // Simulate OTP checks (e.g., 123456)
    if (data.otp !== '123456') {
      throw new Error('Invalid or expired OTP code');
    }

    const mockSession: UserSession = {
      user: {
        id: 'usr_mock_002',
        email: data.email,
        fullName: 'New Guardian User',
        role: 'citizen',
      },
      session: {
        accessToken: 'mock_jwt_token_' + Math.random().toString(36).substr(2),
        expiresIn: 3600,
      },
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(mockSession));
    return mockSession;
  },

  /**
   * Simulates sending password reset link/email
   */
  async resetPasswordForEmail(data: ForgotPasswordInput): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate API latency

    return {
      message: 'Password reset link has been dispatched to your email address.',
    };
  },

  /**
   * Sign out current user session
   */
  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    localStorage.removeItem(SESSION_KEY);
  }
};