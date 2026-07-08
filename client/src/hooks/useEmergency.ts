'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { emergencyService } from '@/services/emergency.service';
import { EmergencyAlert, TriggerAlertRequest } from '@/types/common';

/**
 * useEmergency — hook for dispatching SOS alerts and fetching alert history.
 */
export function useEmergency() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAlert, setLastAlert] = useState<EmergencyAlert | null>(null);
  const [alertHistory, setAlertHistory] = useState<EmergencyAlert[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const triggerAlert = useCallback(async (payload: TriggerAlertRequest): Promise<EmergencyAlert | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await emergencyService.triggerAlert(payload);
      setLastAlert(data);
      toast.success('Emergency SOS dispatched successfully!');
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send SOS alert.';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAlertHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await emergencyService.getAlertHistory();
      setAlertHistory(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load alert history.';
      toast.error(message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  return {
    triggerAlert,
    fetchAlertHistory,
    lastAlert,
    alertHistory,
    isLoading,
    historyLoading,
    error,
  };
}
