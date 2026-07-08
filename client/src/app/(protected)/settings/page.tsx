'use client';

import React, { useState } from 'react';
import { Shield, Bell, Eye, Database, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { signOut } = useAuth();
  const [notif, setNotif] = useState(true);
  const [ocr, setOcr] = useState(true);

  return (
    <div className="space-y-6 pb-12 text-gray-900">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">App Preferences</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Customize your local safety shield and browser notification logs
        </p>
      </div>

      <div className="max-w-2xl bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-gray-800">Security Shield Settings</h3>

        <div className="divide-y divide-gray-100">
          {/* Setting item 1 */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 mt-0.5">
                <Bell size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Threat Alerts</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Send instant push notification logs when active SMS campaigns target your region.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notif}
              onChange={() => setNotif(!notif)}
              className="w-8 h-4 rounded-full bg-gray-250 border border-gray-300 text-blue-600 focus:ring-blue-500/25"
              aria-label="Toggle Threat Alerts"
            />
          </div>

          {/* Setting item 2 */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 mt-0.5">
                <Eye size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Client-Side OCR Extraction</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Parse screenshot texts locally in browser memory without caching files on server nodes.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={ocr}
              onChange={() => setOcr(!ocr)}
              className="w-8 h-4 rounded-full bg-gray-250 border border-gray-300 text-blue-600 focus:ring-blue-500/25"
              aria-label="Toggle Client-Side OCR Extraction"
            />
          </div>

          {/* Logout Action */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-600 mt-0.5">
                <LogOut size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Authorization Console</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Sign out and terminate the active secure local browser node session.</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all shadow-2xs"
            >
              Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
