'use client';
import React from 'react';

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Add User
        </button>
      </div>
      
      <div className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#222222] flex justify-between items-center">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-[#1A1A1A] border border-[#333333] text-sm text-white rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-red-500/50"
          />
        </div>
        <div className="p-8 text-center text-gray-500">
          User table implementation goes here.
        </div>
      </div>
    </div>
  );
}
