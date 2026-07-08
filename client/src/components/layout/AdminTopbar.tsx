'use client';
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminTopbar() {
  const pathname = usePathname();
  
  // Format pathname to display as a title
  const title = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="h-16 bg-[#111111] border-b border-[#222222] flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button (placeholder if needed later) */}
        <button className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A1A1A]">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-white">{displayTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#1A1A1A] border border-[#333333] text-sm text-white rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 w-64 transition-all"
          />
        </div>
        
        <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#1A1A1A] relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#111111]"></span>
        </button>
      </div>
    </header>
  );
}
