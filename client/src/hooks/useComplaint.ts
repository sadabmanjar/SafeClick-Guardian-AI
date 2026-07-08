'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { complaintService } from '@/services/complaint.service';
import { Complaint, CreateComplaintRequest } from '@/types/common';

/**
 * useComplaint — hook for submitting a new complaint.
 */
export function useComplaint() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  const submit = useCallback(async (payload: CreateComplaintRequest): Promise<Complaint | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await complaintService.create(payload);
      setSubmittedComplaint(data);
      toast.success('Complaint submitted successfully!');
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit complaint.';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { submit, submittedComplaint, isLoading, error };
}

/**
 * useComplaintHistory — hook for fetching complaint history.
 */
export function useComplaintHistory() {
  const [history, setHistory] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await complaintService.getHistory();
      setHistory(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load complaint history.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchHistory, history, isLoading, error };
}
