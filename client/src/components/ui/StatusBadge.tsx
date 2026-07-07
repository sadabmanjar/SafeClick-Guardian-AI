'use client';

import React from 'react';

interface StatusBadgeProps {
  variant: 'safe' | 'medium' | 'high';
  label: string;
  dot?: boolean;
  className?: string;
}

export default function StatusBadge({ variant, label, dot, className = '' }: StatusBadgeProps) {
  let bgClass = '';
  let textClass = '';
  let borderClass = '';
  let dotClass = '';

  switch (variant) {
    case 'safe':
      bgClass = 'bg-success/15';
      textClass = 'text-success';
      borderClass = 'border-success/35';
      dotClass = 'bg-success';
      break;
    case 'medium':
      bgClass = 'bg-warning/15';
      textClass = 'text-warning';
      borderClass = 'border-warning/35';
      dotClass = 'bg-warning';
      break;
    case 'high':
      bgClass = 'bg-danger/15';
      textClass = 'text-danger';
      borderClass = 'border-danger/35';
      dotClass = 'bg-danger';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgClass} ${textClass} ${borderClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClass} animate-pulse`} />}
      {label}
    </span>
  );
}
