import React from 'react';

export const NotificationSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-1/4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};
