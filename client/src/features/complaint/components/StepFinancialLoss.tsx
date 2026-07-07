'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { ComplaintFormData } from './ComplaintWizard';

const paymentModes = [
  'UPI (Google Pay / PhonePe / Paytm)',
  'NEFT / RTGS / IMPS',
  'Debit Card',
  'Credit Card',
  'Net Banking',
  'Cash Deposit',
  'Cryptocurrency',
  'Gift Cards / Vouchers',
  'Other',
];

const banks = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Kotak Mahindra Bank',
  'Union Bank of India',
  'Yes Bank',
  'IndusInd Bank',
  'Paytm Payments Bank',
  'Airtel Payments Bank',
  'Other',
];

interface Props {
  form: UseFormReturn<ComplaintFormData>;
}

export default function StepFinancialLoss({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-5 float-up">
      {/* Amount and transaction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amountLost" className="block text-xs font-semibold text-foreground mb-1.5">
            Total Amount Defrauded (₹) <span className="text-danger">*</span>
          </label>
          <p className="text-[11px] text-muted-foreground mb-1.5">
            Total amount transferred to fraudster
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
            <input
              id="amountLost"
              type="number"
              placeholder="0"
              {...register('amountLost', {
                required: 'Amount is required',
                min: { value: 1, message: 'Amount must be greater than ₹0' },
              })}
              className="w-full bg-input border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          {errors.amountLost && (
            <p className="text-danger text-xs mt-1">{errors.amountLost.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="transactionDate" className="block text-xs font-semibold text-foreground mb-1.5">
            Date of Transaction
          </label>
          <p className="text-[11px] text-muted-foreground mb-1.5">
            When was the money debited?
          </p>
          <input
            id="transactionDate"
            type="date"
            {...register('transactionDate')}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Transaction ID */}
      <div>
        <label htmlFor="transactionId" className="block text-xs font-semibold text-foreground mb-1.5">
          Transaction ID / UTR Number <span className="text-danger">*</span>
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          Found in your bank SMS, UPI app, or net banking transaction history. This is critical for police to trace funds.
        </p>
        <input
          id="transactionId"
          type="text"
          placeholder="e.g. UTR123456789012 or T2606301234567"
          {...register('transactionId', { required: 'Transaction ID is required for police complaint' })}
          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        />
        {errors.transactionId && (
          <p className="text-danger text-xs mt-1">{errors.transactionId.message}</p>
        )}
      </div>

      {/* Bank and payment mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bankName" className="block text-xs font-semibold text-foreground mb-1.5">
            Your Bank Name <span className="text-danger">*</span>
          </label>
          <select
            id="bankName"
            {...register('bankName', { required: 'Bank name is required' })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          >
            <option value="">Select your bank...</option>
            {banks.map((b) => (
              <option key={`bank-opt-${b}`} value={b}>{b}</option>
            ))}
          </select>
          {errors.bankName && (
            <p className="text-danger text-xs mt-1">{errors.bankName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="paymentMode" className="block text-xs font-semibold text-foreground mb-1.5">
            Mode of Payment <span className="text-danger">*</span>
          </label>
          <select
            id="paymentMode"
            {...register('paymentMode', { required: 'Payment mode is required' })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          >
            <option value="">Select payment mode...</option>
            {paymentModes.map((pm) => (
              <option key={`payment-mode-opt-${pm}`} value={pm}>{pm}</option>
            ))}
          </select>
          {errors.paymentMode && (
            <p className="text-danger text-xs mt-1">{errors.paymentMode.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="accountNumber" className="block text-xs font-semibold text-foreground mb-1.5">
            Your Account Number (Last 4 digits)
          </label>
          <p className="text-[11px] text-muted-foreground mb-1.5">Only last 4 digits required for complaint</p>
          <input
            id="accountNumber"
            type="text"
            maxLength={4}
            placeholder="XXXX"
            {...register('accountNumber', {
              maxLength: { value: 4, message: 'Enter only last 4 digits' },
            })}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {errors.accountNumber && (
            <p className="text-danger text-xs mt-1">{errors.accountNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="upiId" className="block text-xs font-semibold text-foreground mb-1.5">
            Your UPI ID (if used)
          </label>
          <input
            id="upiId"
            type="text"
            placeholder="yourname@okaxis"
            {...register('upiId')}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Complainant personal details */}
      <div className="glass-card-elevated rounded-xl border border-border p-4 space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Your Personal Details (for complaint)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="complainantName" className="block text-xs font-semibold text-foreground mb-1.5">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              id="complainantName"
              type="text"
              placeholder="As per Aadhaar card"
              {...register('complainantName', { required: 'Your name is required' })}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            {errors.complainantName && (
              <p className="text-danger text-xs mt-1">{errors.complainantName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="complainantPhone" className="block text-xs font-semibold text-foreground mb-1.5">
              Your Mobile Number <span className="text-danger">*</span>
            </label>
            <input
              id="complainantPhone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              {...register('complainantPhone', { required: 'Your phone number is required' })}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            {errors.complainantPhone && (
              <p className="text-danger text-xs mt-1">{errors.complainantPhone.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="complainantEmail" className="block text-xs font-semibold text-foreground mb-1.5">
              Your Email Address
            </label>
            <input
              id="complainantEmail"
              type="email"
              placeholder="your.email@gmail.com"
              {...register('complainantEmail')}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div>
            <label htmlFor="complainantAadhaarLast4" className="block text-xs font-semibold text-foreground mb-1.5">
              Aadhaar (Last 4 digits)
            </label>
            <input
              id="complainantAadhaarLast4"
              type="text"
              maxLength={4}
              placeholder="XXXX"
              {...register('complainantAadhaarLast4', {
                maxLength: { value: 4, message: 'Enter only last 4 digits' },
              })}
              className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
        <div>
          <label htmlFor="complainantAddress" className="block text-xs font-semibold text-foreground mb-1.5">
            Your Complete Address
          </label>
          <textarea
            id="complainantAddress"
            rows={2}
            placeholder="House No., Street, Area, City, District, State, PIN"
            {...register('complainantAddress')}
            className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}