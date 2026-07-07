'use client';

import React from 'react';
import { User, Mail, Shield, MapPin, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-12 text-gray-900">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Profile</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Manage your digital node settings and security credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Stats */}
        <div className="md:col-span-1 bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
            <User size={36} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Rahul Sharma</h3>
          <p className="text-xs text-gray-400 font-medium">Citizen • Madhya Pradesh</p>
          <div className="w-full border-t border-gray-100 mt-4 pt-4 text-left space-y-3 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Node Status</span>
              <span className="font-bold text-green-600">ACTIVE & SECURED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider">Last Scan</span>
              <span className="font-mono text-gray-500">Today, 2:14 PM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Account Details Form */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-gray-800">Security Node Specifications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</span>
              <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium">
                <Mail size={14} className="text-gray-400" />
                <span>{user?.email || 'rahul.sharma@safeclick.gov'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</span>
              <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium">
                <Shield size={14} className="text-gray-400" />
                <span>+91 98765 43210</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Geolocated Node</span>
              <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium">
                <MapPin size={14} className="text-gray-400" />
                <span>Bhopal, Madhya Pradesh</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Encryption Passkey</span>
              <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium">
                <Key size={14} className="text-gray-400" />
                <span>••••••••••••••••</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
