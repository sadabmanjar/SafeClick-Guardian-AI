import React from 'react';
import { INotification } from '../types';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const priorityVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm transition-colors',
  {
    variants: {
      priority: {
        low: 'bg-slate-100 text-slate-700',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800 border border-red-200 animate-pulse',
      },
    },
    defaultVariants: {
      priority: 'low',
    },
  }
);

interface PriorityBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof priorityVariants> {
  priority: INotification['priority'];
}

export const PriorityBadge = ({ priority, className, ...props }: PriorityBadgeProps) => {
  return (
    <div className={cn(priorityVariants({ priority }), className)} {...props}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </div>
  );
};

const typeIconColors: Record<INotification['type'], string> = {
  success: 'text-green-500 bg-green-50',
  warning: 'text-orange-500 bg-orange-50',
  error: 'text-red-500 bg-red-50',
  info: 'text-blue-500 bg-blue-50',
  security: 'text-rose-700 bg-rose-50',
  ai: 'text-purple-500 bg-purple-50',
  complaint: 'text-indigo-500 bg-indigo-50',
  emergency: 'text-red-600 bg-red-100',
  admin: 'text-slate-700 bg-slate-200',
};

export const getTypeStyles = (type: INotification['type']) => {
  return typeIconColors[type] || typeIconColors.info;
};
