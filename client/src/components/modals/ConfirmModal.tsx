'use client';
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-card-elevated rounded-2xl border border-border p-6 w-full max-w-md float-up">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X size={16} className="text-muted-foreground" />
        </button>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          variant === 'danger' ? 'bg-danger/15 border border-danger/30' : 'bg-warning/15 border border-warning/30'
        }`}>
          <AlertTriangle size={22} className={variant === 'danger' ? 'text-danger' : 'text-warning'} />
        </div>
        <h3 id="modal-title" className="text-base font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-all duration-150"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-150 active:scale-95 ${
              variant === 'danger' ?'bg-danger text-danger-foreground hover:bg-danger/90 neon-glow-danger' :'bg-warning text-background hover:bg-warning/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}