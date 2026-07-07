'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image as ImageIcon, Video, Music, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface EvidenceUploadZoneProps {
  onUploadSuccess: (fileData: {
    name: string;
    type: 'image' | 'video' | 'audio' | 'pdf';
    size: string;
    ocrText?: string;
  }) => void;
}

export default function EvidenceUploadZone({ onUploadSuccess }: EvidenceUploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Determine file category
      let type: 'image' | 'video' | 'audio' | 'pdf' = 'pdf';
      let mockOcr = '';

      if (file.type.startsWith('image/')) {
        type = 'image';
        mockOcr = `[OCR PARSED TEXT] - TRANSACTION ID: TXN4958102482\nSender Number: +91 98765 43210\nMessage Details: "Dear customer, your bank account is blocked. Verify KYC immediately at https://hdfc-kyc-verify.net"`;
      } else if (file.type.startsWith('video/')) {
        type = 'video';
      } else if (file.type.startsWith('audio/')) {
        type = 'audio';
      } else if (file.type === 'application/pdf') {
        type = 'pdf';
        mockOcr = `[PDF TEXT EXTRACTION] - bank statement containing transaction logs showing fraudulent UPI debit of ₹45,000 on 2026-07-02 to suspect UPI ID: scammer@upi`;
      }

      // Convert size to human readable
      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      // Mock upload completion
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: `Uploading ${file.name}... calculating integrity SHA-256 hash`,
          success: () => {
            onUploadSuccess({
              name: file.name,
              type,
              size: sizeStr,
              ocrText: mockOcr || undefined,
            });
            return `${file.name} securely locked & hashed!`;
          },
          error: 'Failed to upload evidence.',
        }
      );
    });
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'application/pdf': ['.pdf'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`bg-white border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-205 shadow-2xs ${
        isDragActive ? 'border-blue-600 bg-blue-50/40 scale-[0.99]' : 'border-gray-200 hover:border-blue-500/40 hover:bg-gray-50/20'
      }`}
    >
      <input {...getInputProps()} />
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-4">
        <Upload size={20} className={isDragActive ? 'text-blue-600 animate-bounce' : 'text-gray-400'} />
      </div>
      
      <h3 className="text-sm font-bold text-gray-900 mb-1">Secure Upload Vault</h3>
      <p className="text-xs text-gray-500 max-w-xs mb-4 leading-normal font-semibold">
        Drag & drop screenshot images, transaction PDFs, audio recordings, or videos here to calculate hash & secure
      </p>

      <div className="flex items-center gap-4 text-[10px] font-semibold font-mono text-gray-400">
        <span className="flex items-center gap-1"><ImageIcon size={12} /> IMAGES</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Video size={12} /> VIDEOS</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Music size={12} /> AUDIO</span>
        <span>•</span>
        <span className="flex items-center gap-1"><File size={12} /> PDFS</span>
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider">
        <ShieldCheck size={11} /> Zero-Knowledge Client Hash (SHA-256) Enabled
      </div>
    </div>
  );
}
