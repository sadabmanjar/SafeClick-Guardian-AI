/**
 * Admin Service
 * Handles admin-only dashboard statistics and management APIs.
 * All endpoints require role: 'admin' or 'super_admin'.
 * The backend enforces this via requireRole() middleware.
 */

import apiClient from '@/lib/api';
import { ApiSuccess } from '@/types/api';
import { AdminStats, ScanResult, Complaint, EmergencyAlert } from '@/types/common';

const ADMIN = '/admin';

export const adminService = {
  /**
   * Fetch aggregated platform statistics for the admin dashboard.
   * GET /api/admin/stats
   */
  async getDashboardStats(): Promise<AdminStats> {
    const response = await apiClient.get<ApiSuccess<AdminStats>>(`${ADMIN}/stats`);
    return response.data.data;
  },

  /**
   * Fetch all scan records platform-wide (admin view).
   * GET /api/admin/scans
   */
  async getAllScans(params?: { page?: number; limit?: number; riskLevel?: string }): Promise<ScanResult[]> {
    const response = await apiClient.get<ApiSuccess<ScanResult[]>>(`${ADMIN}/scans`, { params });
    return response.data.data;
  },

  /**
   * Fetch all complaints platform-wide (admin view).
   * GET /api/admin/complaints
   */
  async getAllComplaints(params?: { page?: number; limit?: number; status?: string }): Promise<Complaint[]> {
    const response = await apiClient.get<ApiSuccess<Complaint[]>>(`${ADMIN}/complaints`, { params });
    return response.data.data;
  },

  /**
   * Fetch all SOS emergency alerts platform-wide (admin view).
   * GET /api/admin/alerts
   */
  async getAllAlerts(): Promise<EmergencyAlert[]> {
    const response = await apiClient.get<ApiSuccess<EmergencyAlert[]>>(`${ADMIN}/alerts`);
    return response.data.data;
  },

  /**
   * Mark an emergency alert as resolved.
   * PATCH /api/admin/alerts/:id/resolve
   */
  async resolveAlert(id: string): Promise<EmergencyAlert> {
    const response = await apiClient.patch<ApiSuccess<EmergencyAlert>>(
      `${ADMIN}/alerts/${id}/resolve`
    );
    return response.data.data;
  },
};
