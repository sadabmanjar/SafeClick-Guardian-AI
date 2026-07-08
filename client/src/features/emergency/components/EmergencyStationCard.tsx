'use client';
import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const stations = [
  {
    id: 'station-001',
    name: 'Cyber Crime Cell — Bhopal HQ',
    address: 'Shivaji Nagar, Bhopal, MP 462001',
    distance: '2.4 km',
    phone: '0755-2443-500',
    hours: '24×7',
    status: 'open' as const,
    jurisdiction: 'Bhopal District',
  },
  {
    id: 'station-002',
    name: 'Cyber Cell — Habibganj PS',
    address: 'Near Railway Station, Bhopal, MP 462024',
    distance: '4.1 km',
    phone: '0755-2550-100',
    hours: '10am – 6pm',
    status: 'open' as const,
    jurisdiction: 'Bhopal Central',
  },
  {
    id: 'station-003',
    name: 'Cyber Crime Cell — Indore',
    address: 'Race Course Road, Indore, MP 452001',
    distance: '189 km',
    phone: '0731-2700-500',
    hours: '24×7',
    status: 'open' as const,
    jurisdiction: 'Indore Division',
  },
];

export default function EmergencyStationCard() {
  const [expanded, setExpanded] = useState<string | null>('station-001');
  const nearest = stations[0];

  return (
    <div className="bg-white border border-gray-200 shadow-xs flex flex-col h-full rounded-2xl">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
        <MapPin size={16} className="text-blue-600" />
        <h3 className="text-sm font-bold text-gray-900">Nearest Cyber Police Stations</h3>
      </div>

      {/* Nearest station highlight */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Nearest — {nearest.distance} away</span>
        </div>
        <p className="text-sm font-bold text-gray-900">{nearest.name}</p>
        <p className="text-xs text-gray-500 mt-1 font-semibold">{nearest.address}</p>
        <div className="flex items-center gap-3 mt-3">
          <a
            href={`tel:${nearest.phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors"
          >
            <Phone size={12} />
            {nearest.phone}
          </a>
          <button
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nearest.name + ' ' + nearest.address)}`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Navigation size={12} />
            Navigate
          </button>
        </div>
      </div>

      {/* Other stations list */}
      <div className="flex-1 overflow-y-auto scrollbar-cyber divide-y divide-gray-100">
        {stations.map((station) => (
          <div key={station.id}>
            <button
              onClick={() => setExpanded(expanded === station.id ? null : station.id)}
              className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/40 transition-colors text-left"
            >
              <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-900 truncate">{station.name}</p>
                  <span className="text-[10px] font-bold font-mono text-blue-600 flex-shrink-0">{station.distance}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-semibold">{station.hours}</span>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${station.status === 'open' ? 'bg-green-600' : 'bg-red-600'}`} />
                </div>
              </div>
              {expanded === station.id ? (
                <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
              )}
            </button>
            {expanded === station.id && (
              <div className="px-5 pb-3 bg-gray-50/30 animate-in fade-in slide-in-from-top-1 duration-150">
                <p className="text-xs text-gray-500 mb-2 font-semibold">{station.address}</p>
                <p className="text-[10px] text-gray-400 mb-2 font-semibold">Jurisdiction: {station.jurisdiction}</p>
                <a
                  href={`tel:${station.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:underline"
                >
                  <Phone size={11} />
                  {station.phone}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}