'use client';
import React, { useState, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Upload, X, FileImage, FileText, File, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ComplaintFormData } from './ComplaintWizard';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'other';
  preview?: string;
}

interface Props {
  form: UseFormReturn<ComplaintFormData>;
}

export default function StepEvidence({ form }: Props) {
  const { register, formState: { errors } } = form;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    newFiles.forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is too large — maximum 20MB per file`);
        return;
      }
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const uploaded: UploadedFile = {
        id: `file-${Date.now()}-${Math.floor(file.size % 10000)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: isImage ? 'image' : isPdf ? 'pdf' : 'other',
        preview: isImage ? URL.createObjectURL(file) : undefined,
      };
      setFiles((prev) => [...prev, uploaded]);
      // TODO: Upload to Supabase Storage — backend integration point
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const FileIcon = ({ type }: { type: UploadedFile['type'] }) => {
    if (type === 'image') return <FileImage size={16} className="text-primary" />;
    if (type === 'pdf') return <FileText size={16} className="text-warning" />;
    return <File size={16} className="text-muted-foreground" />;
  };

  const evidenceTypes = [
    { id: 'ev-screenshot', label: 'Screenshots of messages', checked: true },
    { id: 'ev-transaction', label: 'Bank/UPI transaction receipt', checked: false },
    { id: 'ev-call-log', label: 'Call logs / recordings', checked: false },
    { id: 'ev-email', label: 'Fraudulent emails', checked: false },
    { id: 'ev-website', label: 'Fake website screenshots', checked: false },
    { id: 'ev-bank-statement', label: 'Bank statement excerpt', checked: false },
  ];

  return (
    <div className="space-y-5 float-up">
      {/* Evidence checklist */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-3">Evidence You Should Collect</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {evidenceTypes.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors ${
                item.checked
                  ? 'bg-success/5 border-success/20' :'bg-muted/30 border-border'
              }`}
            >
              {item.checked ? (
                <CheckCircle size={14} className="text-success flex-shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
              )}
              <span className="text-xs text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* File upload zone */}
      <div>
        <p className="text-xs font-semibold text-foreground mb-1.5">Upload Evidence Files</p>
        <p className="text-[11px] text-muted-foreground mb-3">
          Screenshots, PDFs, transaction receipts — up to 20MB per file. All files are encrypted and stored securely.
        </p>
        <div
          className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileAdd}
            className="hidden"
            aria-label="Upload evidence files"
          />
          <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF, DOC up to 20MB each</p>
        </div>

        {/* Uploaded files list */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border group"
              >
                {file.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.preview}
                    alt={`Evidence file: ${file.name}`}
                    className="w-8 h-8 rounded object-cover border border-border flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-muted border border-border flex items-center justify-center flex-shrink-0">
                    <FileIcon type={file.type} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{file.size}</p>
                </div>
                <CheckCircle size={14} className="text-success flex-shrink-0" />
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded hover:bg-danger/20 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={12} className="text-muted-foreground hover:text-danger transition-colors" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evidence description */}
      <div>
        <label htmlFor="evidenceDescription" className="block text-xs font-semibold text-foreground mb-1.5">
          Evidence Description <span className="text-danger">*</span>
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          Describe the evidence you have collected — list all screenshots, messages, and documents
        </p>
        <textarea
          id="evidenceDescription"
          rows={4}
          placeholder="I have the following evidence:&#10;1. Screenshot of the fraudulent WhatsApp message received on [date]&#10;2. Bank transaction receipt showing debit of ₹[amount]&#10;3. Screenshot of the fake website URL..."
          {...register('evidenceDescription', {
            required: 'Please describe your evidence',
            minLength: { value: 20, message: 'Minimum 20 characters required' },
          })}
          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none scrollbar-cyber"
        />
        {errors.evidenceDescription && (
          <p className="text-danger text-xs mt-1">{errors.evidenceDescription.message}</p>
        )}
      </div>

      {/* NCRP complaint number */}
      <div>
        <label htmlFor="ncrpComplaintNo" className="block text-xs font-semibold text-foreground mb-1.5">
          NCRP Complaint Number (if already filed)
        </label>
        <p className="text-[11px] text-muted-foreground mb-1.5">
          If you have already reported on cybercrime.gov.in, enter your complaint reference number
        </p>
        <input
          id="ncrpComplaintNo"
          type="text"
          placeholder="e.g. 26/MP/2026/XXXXX"
          {...register('ncrpComplaintNo')}
          className="w-full bg-input border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono-data placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[9px] font-bold text-primary">i</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your uploaded files will be included in the evidence package. The generated complaint will reference these as exhibits. Keep original files safe — do not delete them from your device.
        </p>
      </div>
    </div>
  );
}