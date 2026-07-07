import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`} />
  );
}

export function AnalyzerLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 space-y-4">
          <Skeleton className="h-48 w-48 rounded-full mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
        <div className="glass-card rounded-xl p-6 space-y-3">
          {['sk-r1', 'sk-r2', 'sk-r3', 'sk-r4'].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}