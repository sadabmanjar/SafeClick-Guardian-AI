'use client';
import React from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import type { ComplaintFormData } from './ComplaintWizard';

const platforms = [
  'WhatsApp', 'Telegram', 'Phone Call', 'SMS', 'Email',
  'Instagram', 'Facebook', 'Twitter/X', 'OLX / Quikr',
  'Google / Search Ad', 'Fake Website', 'UPI App', 'Other',
];

const fraudTypes = [
  'UPI / Bank Transfer Fraud',
  'OTP Fraud (Phone Impersonation)',
  'KYC Update Scam',
  'Fake Investment / Trading Scam',
  'Fake Job Offer',
  'Lottery / Prize Fraud',
  'Online Shopping Fraud',
  'Loan App Fraud',
  'Romance / Sextortion Scam',
  'Fake Customer Care',
  'Phishing Website',
  'Social Media Account Hack',
  'Ransomware / Malware',
  'Other',
];

interface Props {
  form?: UseFormReturn<ComplaintFormData>;
}

export default function StepIncidentDetails({ form }: Props) {
  const methods = useFormContext<ComplaintFormData>();
  const { register, formState: { errors } } = form ?? methods;

  return (
    <div className="space-y-5 float-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Incident Date */}
        <div>
          <label htmlFor="incidentDate" className="block text-xs font-semibold text-foreground mb-1.5">
            Date of Incident <span className="text-danger">*</span>
          </label>
          <input
            id="incidentDate"
            type="date"
            {...register('incidentDate', { required: 'Date of incident is required' })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {errors.incidentDate && (
            <p className="text-danger text-xs mt-1">{errors.incidentDate.message}</p>
          )}
        </div>

        {/* Incident Time */}
        <div>
          <label htmlFor="incidentTime" className="block text-xs font-semibold text-foreground mb-1.5">
            Approximate Time
          </label>
          <input
            id="incidentTime"
            type="time"
            {...register('incidentTime')}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Platform */}
        <div>
          <label htmlFor="platform" className="block text-xs font-semibold text-foreground mb-1.5">
            Platform / Medium Used <span className="text-danger">*</span>
          </label>
          <p className="text-[11px] text-muted-foreground mb-1.5">How did the fraudster contact you?</p>
          <select
            id="platform"
            {...register('platform', { required: 'Platform is required' })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          >
            <option value="">Select platform...</option>
            {platforms.map((p) => (
              <option key={`platform-opt-${p}`} value={p}>{p}</option>
            ))}
          </select>
          {errors.platform && (
            <p className="text-danger text-xs mt-1">{errors.platform.message}</p>
          )}
        </div>

        {/* Fraud Type */}
        <div>
          <label htmlFor="fraudType" className="block text-xs font-semibold text-foreground mb-1.5">
            Type of Fraud <span className="text-danger">*</span>
          </label>
          <p className="text-[11px] text-muted-foreground mb-1.5">Select the category that best matches</p>
          <select
            id="fraudType"
            {...register('fraudType', { required: 'Fraud type is required' })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          >
            <option value="">Select fraud type...</option>
            {fraudTypes.map((ft) => (
              <option key={`fraud-type-opt-${ft}`} value={ft}>{ft}</option>
            ))}
          </select>
          {errors.fraudType && (
            <p className="text-danger text-xs mt-1">{errors.fraudType.message}</p>
          )}
        </div>
      </div>

      {/* Suspect details */}
      <div className="glass-card-elevated rounded-xl border border-border p-4 space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Suspect Details (if known)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="suspectPhone" className="block text-xs font-semibold text-foreground mb-1.5">
              Suspect Phone Number
            </label>
            <input
              id="suspectPhone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              {...register('suspectPhone')}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label htmlFor="suspectEmail" className="block text-xs font-semibold text-foreground mb-1.5">
              Suspect Email
            </label>
            <input
              id="suspectEmail"
              type="email"
              placeholder="suspect@domain.com"
              {...register('suspectEmail')}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label htmlFor="suspectAccountNo" className="block text-xs font-semibold text-foreground mb-1.5">
              Suspect Bank Account
            </label>
            <input
              id="suspectAccountNo"
              type="text"
              placeholder="Account / UPI ID"
              {...register('suspectAccountNo')}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-semibold text-foreground mb-1.5">
          Detailed Incident Description <span className="text-danger">*</span>
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          Describe the complete sequence of events — what was promised, what was said, and what actions you took
        </p>
        <textarea
          id="description"
          rows={5}
          placeholder="On [date], I received a call/message from [number/handle] claiming to be from [organization]. They told me that [what they said]. I was asked to [what you did]. As a result, an amount of ₹[amount] was debited from my account..."
          {...register('description', {
            required: 'Incident description is required',
            minLength: { value: 50, message: 'Please provide at least 50 characters of description' },
          })}
          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none scrollbar-cyber"
        />
        {errors.description && (
          <p className="text-danger text-xs mt-1">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}