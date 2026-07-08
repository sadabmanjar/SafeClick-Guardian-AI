'use client';

import React from 'react';
import BackButton from '@/components/ui/BackButton';

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Subtitle / description */
  subtitle?: string;
  /** Right-side slot for badges, buttons, etc. */
  actions?: React.ReactNode;
  /** Show the back button. Default: true */
  showBack?: boolean;
  /** Override back destination */
  backHref?: string;
  /** Override back label */
  backLabel?: string;
}

/**
 * Reusable page header with back button, title, subtitle and an optional actions slot.
 *
 * Usage:
 *   <PageHeader title="AI Scam Analyzer" subtitle="Get instant AI risk assessment" />
 *   <PageHeader title="Heatmap" showBack={false} actions={<RefreshButton />} />
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
  showBack = true,
  backHref,
  backLabel,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {showBack && (
        <div className="-ml-1">
          <BackButton href={backHref} label={backLabel} />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
