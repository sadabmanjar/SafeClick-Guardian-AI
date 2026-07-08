'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { scanService } from '@/services/scan.service';
import { ScanResult, ScanRequest } from '@/types/common';

/**
 * useScan — hook for running AI threat detection analysis.
 * Exposes loading, error, result states and analyze() trigger.
 */
export function useScan() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (payload: ScanRequest): Promise<ScanResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await scanService.analyze(payload);
      setResult(data);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed.';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { analyze, result, isLoading, error, reset };
}

/**
 * useScanHistory — hook for fetching the user's scan history.
 */
export function useScanHistory() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await scanService.getHistory();
      setHistory(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load scan history.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteScan = useCallback(async (id: string) => {
    try {
      await scanService.delete(id);
      setHistory((prev) => prev.filter((s) => s._id !== id));
      toast.success('Scan entry deleted from history.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete scan.';
      toast.error(message);
    }
  }, []);

  return { fetchHistory, deleteScan, history, isLoading, error };
}
