'use client';

import React from 'react';

interface PageLoaderProps {
  /** Message shown below the spinner */
  message?: string;
  /** Full-page overlay mode (covers the whole screen). Default: false = fills parent container */
  fullPage?: boolean;
}

/**
 * Reusable loading spinner.
 *
 * Usage:
 *   <PageLoader />                          // fills parent
 *   <PageLoader message="Loading map..." /> // with custom text
 *   <PageLoader fullPage />                 // fixed fullscreen overlay
 */
export default function PageLoader({ message = 'Loading...', fullPage = false }: PageLoaderProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <Spinner />
        {message && <p className="mt-4 text-sm font-semibold text-gray-500">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[280px] py-16">
      <Spinner />
      {message && <p className="mt-4 text-sm font-semibold text-gray-400">{message}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <div className="w-12 h-12 rounded-full border-4 border-gray-100 dark:border-zinc-800" />
      {/* Spinning arc */}
      <div className="absolute w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
      {/* Inner dot */}
      <div className="absolute w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
    </div>
  );
}
