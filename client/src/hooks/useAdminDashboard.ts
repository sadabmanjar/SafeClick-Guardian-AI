'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import { AdminStats, ScanResult, Complaint, EmergencyAlert } from '@/types/common';

/**
 * useAdminDashboard — hook for the admin control panel.
 * Exposes stats, scans, complaints, and alerts with loading states.
 */
export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard stats.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllScans = useCallback(async () => {
    try {
      const data = await adminService.getAllScans();
      setScans(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load scans.';
      toast.error(message);
    }
  }, []);

  const fetchAllComplaints = useCallback(async () => {
    try {
      const data = await adminService.getAllComplaints();
      setComplaints(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load complaints.';
      toast.error(message);
    }
  }, []);

  const fetchAllAlerts = useCallback(async () => {
    try {
      const data = await adminService.getAllAlerts();
      setAlerts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load alerts.';
      toast.error(message);
    }
  }, []);

  const resolveAlert = useCallback(async (id: string) => {
    try {
      const updated = await adminService.resolveAlert(id);
      setAlerts((prev) => prev.map((a) => (a._id === id ? updated : a)));
      toast.success('Alert marked as resolved.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resolve alert.';
      toast.error(message);
    }
  }, []);

  return {
    stats,
    scans,
    complaints,
    alerts,
    isLoading,
    error,
    fetchStats,
    fetchAllScans,
    fetchAllComplaints,
    fetchAllAlerts,
    resolveAlert,
  };
}
