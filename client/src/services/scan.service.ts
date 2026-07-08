/**
 * Scan Service
 * Handles all AI threat detection API calls to /api/scans
 * No component should call apiClient directly — always use this service.
 */

import apiClient from '@/lib/api';
import { ApiSuccess, ApiError } from '@/types/api';
import { ScanResult, ScanRequest } from '@/types/common';

const ENDPOINT = '/api/scans';

export const scanService = {
  /**
   * Submit content for AI-powered threat analysis.
   * Runs the full hybrid detection pipeline (keyword + URL + email + phone + domain + Gemini AI).
   * POST /api/scans/analyze
   */
  async analyze(payload: ScanRequest): Promise<ScanResult> {
    const response = await apiClient.post<ApiSuccess<ScanResult>>(
      `${ENDPOINT}/analyze`,
      payload
    );
    return response.data.data;
  },

  /**
   * Fetch the authenticated user's complete scan history.
   * GET /api/scans/history
   */
  async getHistory(): Promise<ScanResult[]> {
    const response = await apiClient.get<ApiSuccess<ScanResult[]>>(
      `${ENDPOINT}/history`
    );
    return response.data.data;
  },

  /**
   * Fetch a single scan record by ID.
   * GET /api/scans/:id
   */
  async getById(id: string): Promise<ScanResult> {
    const response = await apiClient.get<ApiSuccess<ScanResult>>(`${ENDPOINT}/${id}`);
    return response.data.data;
  },

  /**
   * Delete a scan record from history.
   * DELETE /api/scans/:id
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<ApiSuccess<null>>(`${ENDPOINT}/${id}`);
    return { message: response.data.message || 'Scan deleted successfully.' };
  },
};

// ── Typed Error Extractor ─────────────────────────────────────────────────
export function extractApiError(err: unknown): ApiError {
  if (err instanceof Error) {
    return { message: err.message };
  }
  return { message: 'An unexpected error occurred.' };
}
