/**
 * Emergency Service
 * Handles SOS alert dispatch and alert history retrieval.
 * Maps to /api/emergency backend routes.
 */

import apiClient from '@/lib/api';
import { ApiSuccess } from '@/types/api';
import { EmergencyAlert, TriggerAlertRequest } from '@/types/common';

const ENDPOINT = '/emergency';

export const emergencyService = {
  /**
   * Dispatch a new SOS / emergency alert.
   * POST /api/emergency
   */
  async triggerAlert(payload: TriggerAlertRequest): Promise<EmergencyAlert> {
    const response = await apiClient.post<ApiSuccess<EmergencyAlert>>(`${ENDPOINT}/trigger`, payload);
    return response.data.data;
  },

  /**
   * Fetch the authenticated user's emergency alert history.
   * GET /api/emergency/alerts
   */
  async getAlertHistory(): Promise<EmergencyAlert[]> {
    const response = await apiClient.get<ApiSuccess<EmergencyAlert[]>>(`${ENDPOINT}/alerts`);
    return response.data.data;
  },
};
