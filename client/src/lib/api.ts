/**
 * Centralized Axios API Client
 *
 * - Single instance shared across all service modules
 * - Automatically injects Supabase Bearer token on every request
 * - Handles 401 by signing out and redirecting to /login
 * - Maps all error responses to clean, user-facing messages
 * - Never use fetch() — always use this client
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabase';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  console.warn('[API Client] NEXT_PUBLIC_API_URL is not defined. API calls will fail.');
}

// ── Create the singleton axios instance ─────────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor: Inject Supabase Access Token ──────────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch {
      // Session fetch failed — request will proceed without auth header
      // The backend will return 401 which the response interceptor handles
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response Interceptor: Global Error Handling ────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — sign out and redirect
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        window.location.href = '/login?error=session_expired';
      }
      return Promise.reject(
        new ApiClientError('Your session has expired. Please log in again.', 401)
      );
    }

    if (status === 403) {
      return Promise.reject(
        new ApiClientError(
          'You do not have permission to perform this action.',
          403
        )
      );
    }

    if (status === 404) {
      return Promise.reject(new ApiClientError('The requested resource was not found.', 404));
    }

    if (status === 422 || status === 400) {
      const serverMessage = extractServerMessage(error);
      return Promise.reject(new ApiClientError(serverMessage || 'Invalid request data.', status));
    }

    if (status === 429) {
      return Promise.reject(
        new ApiClientError('Too many requests. Please slow down and try again.', 429)
      );
    }

    if (status && status >= 500) {
      return Promise.reject(
        new ApiClientError(
          'Server error. Our team has been notified. Please try again shortly.',
          status
        )
      );
    }

    if (!error.response) {
      // Network error — no response received
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(
          new ApiClientError(
            'Request timed out. Check your connection and try again.',
            408
          )
        );
      }
      return Promise.reject(
        new ApiClientError(
          'Network error. Please check your internet connection.',
          0
        )
      );
    }

    return Promise.reject(new ApiClientError(extractServerMessage(error) || error.message, status ?? 0));
  }
);

// ── ApiClientError Class ───────────────────────────────────────────────────
export class ApiClientError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
  }
}

// ── Helper: Extract server error message ────────────────────────────────────
function extractServerMessage(error: AxiosError): string {
  const data = error.response?.data as Record<string, unknown> | undefined;
  if (!data) return '';
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  return '';
}

export default apiClient;