'use client';
import React, { useState, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Upload, X, FileImage, FileText, File, CheckCircle, ShieldAlert } from 'lucide-react';
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
  const { register, setValue, formState: { errors } } = form;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const evidenceTypes = [
    { id: 'ev-screenshot', label: 'Screenshots of messages' },
    { id: 'ev-transaction', label: 'Bank/UPI transaction receipt' },
    { id: 'ev-call-log', label: 'Call logs / recordings' },
    { id: 'ev-email', label: 'Fraudulent emails' },
    { id: 'ev-website', label: 'Fake website screenshots' },
    { id: 'ev-bank-statement', label: 'Bank statement excerpt' },
  ];

  const [checkedItems, setCheckedItems] = useState<string[]>(['ev-screenshot']);

  const handleToggleItem = (id: string) => {
    let newChecked: string[];
    if (checkedItems.includes(id)) {
      newChecked = checkedItems.filter((item) => item !== id);
    } else {
      newChecked = [...checkedItems, id];
    }
    setCheckedItems(newChecked);

    // Generate description text based on checked items
    const selectedLabels = evidenceTypes
      .filter((item) => newChecked.includes(item.id))
      .map((item) => item.label);

    if (selectedLabels.length > 0) {
      const descriptionText = `I have collected the following evidence:\n${selectedLabels
        .map((label, index) => `${index + 1}. ${label}`)
        .join('\n')}`;
      setValue('evidenceDescription', descriptionText, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('evidenceDescription', '', { shouldValidate: true, shouldDirty: true });
    }
  };

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
      // Update description with a reference to the uploaded file name
      toast.success(`Attached ${file.name} to evidence files`);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const FileIcon = ({ type }: { type: UploadedFile['type'] }) => {
    if (type === 'image') return <FileImage size={16} className="text-blue-600" />;
    if (type === 'pdf') return <FileText size={16} className="text-red-500" />;
    return <File size={16} className="text-gray-500" />;
  };

  return (
    <div className="space-y-5 float-up">
      {/* Evidence checklist */}
      <div>
        <p className="text-xs font-semibold text-gray-900 mb-3">Evidence You Should Collect</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {evidenceTypes.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleToggleItem(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${
                  isChecked
                    ? 'bg-green-50 border-green-200 text-green-700 font-semibold' 
                    : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isChecked ? (
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0 bg-white" />
                )}
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* File upload zone */}
      <div>
        <p className="text-xs font-semibold text-gray-900 mb-1.5">Upload Evidence Files</p>
        <p className="text-[11px] text-gray-500 mb-3">
          Screenshots, PDFs, transaction receipts — up to 20MB per file. All files are encrypted and stored securely.
        </p>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-500/40 hover:bg-gray-50/20 transition-all cursor-pointer group"
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
          <Upload size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-900">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF, DOC up to 20MB each</p>
        </div>

        {/* Uploaded files list */}
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50/50 border border-gray-200 group"
              >
                {file.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.preview}
                    alt={`Evidence file: ${file.name}`}
                    className="w-8 h-8 rounded object-cover border border-gray-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-150 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <FileIcon type={file.type} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-450 font-semibold">{file.size}</p>
                </div>
                <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={12} className="text-gray-450 hover:text-red-600 transition-colors" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evidence description */}
      <div>
        <label htmlFor="evidenceDescription" className="block text-xs font-bold text-gray-900 mb-1.5">
          Evidence Description <span className="text-red-500">*</span>
        </label>
        <p className="text-[11px] text-gray-400 font-semibold mb-1.5">
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
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none font-semibold scrollbar-cyber"
        />
        {errors.evidenceDescription && (
          <p className="text-red-600 text-xs mt-1 font-bold flex items-center gap-1.5">
            <ShieldAlert size={12} /> {errors.evidenceDescription.message}
          </p>
        )}
      </div>

      {/* NCRP complaint number */}
      <div>
        <label htmlFor="ncrpComplaintNo" className="block text-xs font-bold text-gray-900 mb-1.5">
          NCRP Complaint Number (if already filed)
        </label>
        <p className="text-[11px] text-gray-400 font-semibold mb-1.5">
          If you have already reported on cybercrime.gov.in, enter your complaint reference number
        </p>
        <input
          id="ncrpComplaintNo"
          type="text"
          placeholder="e.g. 26/MP/2026/XXXXX"
          {...register('ncrpComplaintNo')}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-semibold"
        />
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50/50 border border-blue-200">
        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[9px] font-bold text-blue-600">i</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed font-semibold">
          Your uploaded files will be included in the evidence package. The generated complaint will reference these as exhibits. Keep original files safe — do not delete them from your device.
        </p>
      </div>
    </div>
  );
}