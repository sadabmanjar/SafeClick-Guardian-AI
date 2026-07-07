'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Loader2, CheckCircle } from 'lucide-react';
import { useComplaint } from '@/hooks/useComplaint';
import { toast } from 'sonner';

interface QuickFormData {
  incidentType: string;
  amountLost: string;
  transactionId: string;
  description: string;
}

const incidentTypes = [
  'UPI / Bank Transfer Fraud',
  'OTP / Phone Fraud',
  'Phishing / Fake Website',
  'Fake Job / Investment',
  'KYC / Account Fraud',
  'Social Media Scam',
  'Online Shopping Fraud',
  'Other',
];

export default function EmergencyQuickForm() {
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const { submit, isLoading: isSubmitting } = useComplaint();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuickFormData>();

  const onSubmit = async (data: QuickFormData) => {
    const result = await submit({
      category: data.incidentType,
      incidentDate: new Date().toISOString(),
      platform: 'Other',
      lossAmount: parseFloat(data.amountLost),
      transactionId: data.transactionId,
      victimDetails: {
        name: 'Quick Reporter',
        phone: 'Not provided',
      },
      narrative: data.description,
    });

    if (result) {
      setComplaintId(result._id);
      setSubmitted(true);
      toast.success(`Emergency complaint filed — ID: ${result._id}`, {
        description: 'Forwarded to Cyber Police. You will receive a call within 30 minutes.',
        duration: 6000,
      });
    }
  };

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl border border-success/30 p-6 flex flex-col items-center justify-center text-center h-full min-h-[320px] neon-glow-success">
        <CheckCircle size={48} className="text-success mb-4" />
        <h3 className="text-base font-bold text-foreground mb-2">Emergency Complaint Filed</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your complaint has been forwarded to the Cyber Crime Cell. Keep this ID safe.
        </p>
        <div className="px-4 py-2 rounded-lg bg-success/15 border border-success/30 mb-4">
          <p className="text-xs text-muted-foreground mb-0.5">Complaint ID</p>
          <p className="text-lg font-bold font-mono-data text-success">{complaintId}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          A cyber officer will contact you within 30 minutes on your registered number.
        </p>
        <a
          href="/complaint-generator"
          className="mt-4 text-xs text-primary hover:underline"
        >
          Generate full formal complaint →
        </a>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-border flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <FileText size={16} className="text-primary" />
        <h3 className="text-sm font-bold text-foreground">Quick Complaint</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">Takes 2 min</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto scrollbar-cyber p-5 space-y-4">
        {/* Incident type */}
        <div>
          <label htmlFor="incidentType" className="block text-xs font-semibold text-foreground mb-1.5">
            Type of Fraud <span className="text-danger">*</span>
          </label>
          <select
            id="incidentType"
            {...register('incidentType', { required: 'Please select fraud type' })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          >
            <option value="">Select fraud type...</option>
            {incidentTypes.map((type) => (
              <option key={`incident-type-${type}`} value={type}>{type}</option>
            ))}
          </select>
          {errors.incidentType && (
            <p className="text-danger text-xs mt-1">{errors.incidentType.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amountLost" className="block text-xs font-semibold text-foreground mb-1.5">
            Amount Lost (₹) <span className="text-danger">*</span>
          </label>
          <input
            id="amountLost"
            type="number"
            placeholder="e.g. 15000"
            {...register('amountLost', {
              required: 'Amount is required',
              min: { value: 1, message: 'Amount must be greater than 0' },
            })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {errors.amountLost && (
            <p className="text-danger text-xs mt-1">{errors.amountLost.message}</p>
          )}
        </div>

        {/* Transaction ID */}
        <div>
          <label htmlFor="transactionId" className="block text-xs font-semibold text-foreground mb-1.5">
            Transaction ID / UTR
          </label>
          <p className="text-[11px] text-muted-foreground mb-1.5">
            Found in your bank SMS or UPI app transaction history
          </p>
          <input
            id="transactionId"
            type="text"
            placeholder="e.g. UTR123456789012"
            {...register('transactionId')}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Brief description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-foreground mb-1.5">
            Brief Description <span className="text-danger">*</span>
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Briefly describe what happened — who contacted you, what they said, what you did..."
            {...register('description', {
              required: 'Please describe the incident',
              minLength: { value: 20, message: 'Minimum 20 characters required' },
            })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none scrollbar-cyber"
          />
          {errors.description && (
            <p className="text-danger text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
            isSubmitting
              ? 'bg-danger/50 text-white cursor-not-allowed' :'bg-danger text-white hover:bg-danger/90 neon-glow-danger'
          }`}
        >
          {isSubmitting ? (
            <><Loader2 size={15} className="animate-spin" /> Filing Emergency Complaint...</>
          ) : (
            <><FileText size={15} /> File Emergency Complaint</>
          )}
        </button>
      </form>
    </div>
  );
}