import React from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Sign In — SafeClick AI Guardian',
  description: 'Secure login portal for SafeClick AI Guardian System',
};

export default function LoginPage() {
  return (
    <main
      className="min-h-screen w-full flex overflow-hidden"
      style={{ background: '#050c1a' }}
    >
      {/* ── LEFT PANEL — Branding & Stats ── */}
      <div
        className="hidden lg:flex flex-col justify-between flex-1 px-16 py-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #071428 0%, #0a1f3d 50%, #071428 100%)',
          borderRight: '1px solid rgba(6,182,212,0.12)',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6,182,212,1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6,182,212,1) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
          }}
        />

        {/* Glowing orbs */}
        <div
          className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)' }}
        />

        {/* Top — Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-900/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="text-base font-black text-white tracking-tight leading-none">SafeClick</p>
            <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mt-0.5">AI Guardian System</p>
          </div>
        </div>

        {/* Center — Hero text */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">AI System Online</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Protect.<br />
              <span style={{ background: 'linear-gradient(90deg, #22d3ee, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Detect.
              </span>
              <br />Respond.
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-sm">
              Madhya Pradesh's AI-powered cyber crime guardian system. Real-time threat detection, instant complaint filing, and district-level scam analytics.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'AI Scam Analyzer', color: 'cyan' },
              { label: 'Live Heatmap', color: 'blue' },
              { label: 'Emergency SOS', color: 'red' },
              { label: 'Evidence Locker', color: 'purple' },
              { label: 'Complaint Generator', color: 'green' },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="px-3 py-1 text-[11px] font-semibold rounded-full border"
                style={{
                  background: `rgba(${color === 'cyan' ? '6,182,212' : color === 'blue' ? '59,130,246' : color === 'red' ? '239,68,68' : color === 'purple' ? '168,85,247' : '34,197,94'}, 0.08)`,
                  borderColor: `rgba(${color === 'cyan' ? '6,182,212' : color === 'blue' ? '59,130,246' : color === 'red' ? '239,68,68' : color === 'purple' ? '168,85,247' : '34,197,94'}, 0.25)`,
                  color: color === 'cyan' ? '#22d3ee' : color === 'blue' ? '#60a5fa' : color === 'red' ? '#f87171' : color === 'purple' ? '#c084fc' : '#4ade80',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom — Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { value: '43,210', label: 'Citizens Protected', color: '#22d3ee' },
            { value: '1,847', label: 'Scans Today', color: '#60a5fa' },
            { value: '96.4%', label: 'AI Accuracy', color: '#4ade80' },
          ].map(({ value, label, color }) => (
            <div key={label} className="space-y-1">
              <p className="text-2xl font-black" style={{ color }}>{value}</p>
              <p className="text-[11px] text-white/30 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Login Form ── */}
      <div
        className="w-full lg:w-[480px] flex flex-col items-center justify-center px-10 py-12 relative flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #060e1e 0%, #050c1a 100%)' }}
      >
        {/* Subtle top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.25), transparent)' }}
        />


        <div className="w-full max-w-[360px]">
          <LoginForm />
        </div>

        {/* Bottom credit */}
        <p className="absolute bottom-6 text-[10px] text-white/15 font-mono tracking-widest text-center">
          MP CYBER CRIME DIVISION · GOVT. OF INDIA
        </p>
      </div>
    </main>
  );
}
