/**
 * Shared API response wrapper types.
 * All Express endpoints return data in one of these shapes.
 */

export interface ApiSuccess<T> {
  status: 'success';
  data: T;
  results?: number;
  message?: string;
  timing?: {
    executionTimeMs: number;
    geminiResponseTimeMs: number;
    databaseSaveTimeMs: number;
  };
}

export interface ApiFail {
  status: 'fail' | 'error';
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFail;

/** Standard API error thrown by the axios error handler */
export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
}
