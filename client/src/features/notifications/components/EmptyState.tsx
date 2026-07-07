import React from 'react';
import { BellOff } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
        <BellOff className="h-8 w-8 text-slate-300" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">No Notifications Yet</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-[200px]">
        You&apos;re all caught up. We&apos;ll notify you when something needs your attention.
      </p>
    </div>
  );
};
