'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom glowing marker creator
const createGlowingMarker = (riskLevel: 'high' | 'medium' | 'low') => {
  let pulseColor = 'bg-danger';
  let borderColor = 'border-danger/30';

  if (riskLevel === 'medium') {
    pulseColor = 'bg-warning';
    borderColor = 'border-warning/30';
  } else if (riskLevel === 'low') {
    pulseColor = 'bg-success';
    borderColor = 'border-success/30';
  }

  return L.divIcon({
    html: `
      <div class="relative w-6 h-6 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full ${pulseColor} opacity-20 animate-ping"></div>
        <div class="w-3 h-3 rounded-full ${pulseColor} border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
      </div>
    `,
    className: 'custom-gps-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export type ScamLocation = {
  id: string;
  lat: number;
  lng: number;
  city: string;
  category: string;
  details: string;
  severity: 'high' | 'medium' | 'low';
  loss: string;
  date: string;
};

interface ScamMapProps {
  locations: ScamLocation[];
  center: [number, number];
  zoom: number;
}

export default function ScamMap({ locations, center, zoom }: ScamMapProps) {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-border/80 shadow-[0_0_30px_rgba(0,102,255,0.05)] bg-black/60">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        key={`${center[0]}-${center[1]}-${zoom}`} // Force re-render map container on location swap
      >
        {/* Dark theme maps tiles layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {locations.map((loc) => {
          const circleColor = loc.severity === 'high' ? '#ef4444' : loc.severity === 'medium' ? '#f59e0b' : '#10b981';
          return (
            <React.Fragment key={loc.id}>
              {/* Risk Radius circle */}
              <Circle
                center={[loc.lat, loc.lng]}
                radius={800} // radius in meters
                pathOptions={{
                  color: circleColor,
                  fillColor: circleColor,
                  fillOpacity: 0.1,
                  weight: 1.5,
                  dashArray: '4,4'
                }}
              />

              {/* Glowing Pulse Marker */}
              <Marker
                position={[loc.lat, loc.lng]}
                icon={createGlowingMarker(loc.severity)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-3 bg-zinc-950 text-foreground border border-border rounded-xl space-y-2 max-w-[240px] text-xs font-sans">
                    <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                      <span className="font-bold text-foreground truncate">{loc.category}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                        loc.severity === 'high' ? 'bg-danger/15 border-danger/35 text-danger' : 
                        loc.severity === 'medium' ? 'bg-warning/15 border-warning/35 text-warning' : 
                        'bg-success/15 border-success/35 text-success'
                      }`}>
                        {loc.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-normal mt-1">{loc.details}</p>
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1.5">
                      <span>Loss: <strong className="text-danger">{loc.loss}</strong></span>
                      <span>{loc.date}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Global CSS tweaks to styling Leaflet popups */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip {
          background: #09090b !important; /* matches zinc-950 */
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
