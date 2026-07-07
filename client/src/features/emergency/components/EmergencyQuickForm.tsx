'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Loader2, CheckCircle } from 'lucide-react';
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuickFormData>();

  const onSubmit = async (data: QuickFormData) => {
    // TODO: Replace with POST /api/complaints/emergency — backend integration point
    await new Promise((r) => setTimeout(r, 1800));
    const id = `EMP-${Date.now().toString().slice(-6)}`;
    setComplaintId(id);
    setSubmitted(true);
    toast.success(`Emergency complaint filed — ID: ${id}`, {
      description: 'Forwarded to Cyber Police. You will receive a call within 30 minutes.',
      duration: 6000,
    });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-6 flex flex-col items-center justify-center text-center h-full min-h-[320px] shadow-xs">
        <CheckCircle size={48} className="text-green-600 mb-4 animate-pulse" />
        <h3 className="text-base font-bold text-gray-900 mb-2">Emergency Complaint Filed</h3>
        <p className="text-xs text-gray-500 mb-4 font-semibold">
          Your complaint has been forwarded to the Cyber Crime Cell. Keep this ID safe.
        </p>
        <div className="px-4 py-2 rounded-lg bg-green-50 border border-green-200 mb-4">
          <p className="text-[10px] text-green-700/80 mb-0.5 font-bold font-mono">COMPLAINT ID</p>
          <p className="text-lg font-bold font-mono text-green-800">{complaintId}</p>
        </div>
        <p className="text-[10px] text-gray-400 font-semibold leading-normal">
          A cyber officer will contact you within 30 minutes on your registered number.
        </p>
        <a
          href="/complaint"
          className="mt-4 text-xs text-blue-600 font-bold hover:underline"
        >
          Generate full formal complaint →
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-full shadow-xs">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
        <FileText size={16} className="text-blue-600" />
        <h3 className="text-sm font-bold text-gray-900">Quick Complaint</h3>
        <span className="text-[10px] font-semibold text-gray-400 ml-auto">Takes 2 min</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto scrollbar-cyber p-5 space-y-4">
        {/* Incident type */}
        <div>
          <label htmlFor="incidentType" className="block text-xs font-bold text-gray-700 mb-1.5">
            Type of Fraud <span className="text-red-600">*</span>
          </label>
          <select
            id="incidentType"
            {...register('incidentType', { required: 'Please select fraud type' })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-blue-500/50 transition-all"
          >
            <option value="">Select fraud type...</option>
            {incidentTypes.map((type) => (
              <option key={`incident-type-${type}`} value={type}>{type}</option>
            ))}
          </select>
          {errors.incidentType && (
            <p className="text-red-600 text-[10px] font-mono mt-1 font-bold">{errors.incidentType.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amountLost" className="block text-xs font-bold text-gray-700 mb-1.5">
            Amount Lost (₹) <span className="text-red-600">*</span>
          </label>
          <input
            id="amountLost"
            type="number"
            placeholder="e.g. 15000"
            {...register('amountLost', {
              required: 'Amount is required',
              min: { value: 1, message: 'Amount must be greater than 0' },
            })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
          />
          {errors.amountLost && (
            <p className="text-red-600 text-[10px] font-mono mt-1 font-bold">{errors.amountLost.message}</p>
          )}
        </div>

        {/* Transaction ID */}
        <div>
          <label htmlFor="transactionId" className="block text-xs font-bold text-gray-700 mb-1.5">
            Transaction ID / UTR
          </label>
          <p className="text-[10px] text-gray-400 mb-1.5 font-semibold leading-normal">
            Found in your bank SMS or UPI app transaction history
          </p>
          <input
            id="transactionId"
            type="text"
            placeholder="e.g. UTR123456789012"
            {...register('transactionId')}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        {/* Brief description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold text-gray-700 mb-1.5">
            Brief Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Briefly describe what happened — who contacted you, what they said, what you did..."
            {...register('description', {
              required: 'Please describe the incident',
              minLength: { value: 20, message: 'Minimum 20 characters required' },
            })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 transition-all resize-none scrollbar-cyber"
          />
          {errors.description && (
            <p className="text-red-600 text-[10px] font-mono mt-1 font-bold">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
            isSubmitting
              ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
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