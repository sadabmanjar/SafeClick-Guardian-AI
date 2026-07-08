/**
 * Complaint Service
 * Handles all cybercrime complaint API calls to /api/complaints
 */

import apiClient from '@/lib/api';
import { ApiSuccess } from '@/types/api';
import { Complaint, CreateComplaintRequest } from '@/types/common';

const ENDPOINT = '/complaints';

export const complaintService = {
  /**
   * Submit a new cybercrime complaint.
   * POST /api/complaints
   */
  async create(payload: CreateComplaintRequest): Promise<Complaint> {
    const response = await apiClient.post<ApiSuccess<Complaint>>(ENDPOINT, payload);
    return response.data.data;
  },

  /**
   * Fetch the authenticated user's complaint history.
   * GET /api/complaints
   */
  async getHistory(): Promise<Complaint[]> {
    const response = await apiClient.get<ApiSuccess<Complaint[]>>(ENDPOINT);
    return response.data.data;
  },

  /**
   * Fetch a single complaint by ID.
   * GET /api/complaints/:id
   */
  async getById(id: string): Promise<Complaint> {
    const response = await apiClient.get<ApiSuccess<Complaint>>(`${ENDPOINT}/${id}`);
    return response.data.data;
  },
};