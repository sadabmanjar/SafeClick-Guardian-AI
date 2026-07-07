'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export const AdminBroadcastForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'admin',
    priority: 'medium',
    target: 'Everyone',
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => apiClient.post('/notifications/broadcast', data),
    onSuccess: () => {
      toast.success('Broadcast sent successfully');
      setFormData({ ...formData, title: '', message: '' });
    },
    onError: () => {
      toast.error('Failed to send broadcast');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4 max-w-2xl">
      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Create Global Broadcast</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            required
            type="text"
            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. System Maintenance"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Target Audience</label>
          <select
            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
          >
            <option value="Everyone">Everyone</option>
            <option value="Citizens">Citizens Only</option>
            <option value="Admins">Admins Only</option>
            <option value="Emergency Team">Emergency Team</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <select
            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select
            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="admin">Admin Notice</option>
            <option value="security">Security Alert</option>
            <option value="info">General Info</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Message</label>
        <textarea
          required
          rows={3}
          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Enter the broadcast message..."
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {mutation.isPending ? 'Sending...' : 'Send Broadcast'}
        </button>
      </div>
    </form>
  );
};
