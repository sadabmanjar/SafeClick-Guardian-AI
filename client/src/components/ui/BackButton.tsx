'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  /** Override the destination. If omitted, uses router.back() */
  href?: string;
  /** Label next to the arrow. Default: "Back" */
  label?: string;
  /** Extra Tailwind classes */
  className?: string;
}

/**
 * Reusable Back Button.
 *
 * Usage:
 *   <BackButton />
 *   <BackButton href="/dashboard" label="Dashboard" />
 *   <BackButton className="mb-6" />
 */
export default function BackButton({ href, label = 'Back', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 group ${className}`}
    >
      <ArrowLeft
        size={15}
        className="text-gray-400 group-hover:text-gray-700 transition-colors group-hover:-translate-x-0.5 transform duration-150"
      />
      {label}
    </button>
  );
}
