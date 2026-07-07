import React from 'react';
import SignupForm from '@/features/auth/components/SignupForm';

export const metadata = {
  title: 'Create Account — SafeClick AI Guardian',
  description: 'Register to access the SafeClick AI Guardian System',
};

export default function SignupPage() {
  return (
    <main
      className="min-h-screen w-full flex overflow-hidden"
      style={{ background: '#050c1a' }}
    >
      {/* ── LEFT PANEL — Branding ── */}
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
            backgroundImage: `linear-gradient(to right, rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,1) 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-900/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="text-base font-black text-white tracking-tight leading-none">SafeClick</p>
            <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mt-0.5">AI Guardian System</p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Join the Shield Network</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Register.<br />
              <span style={{ background: 'linear-gradient(90deg, #22d3ee, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Protect.
              </span>
              <br />Stay Safe.
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-sm">
              Join Madhya Pradesh's AI-powered cyber crime guardian network. Get instant scam alerts, file complaints in seconds, and contribute to a safer digital India.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {[
              { icon: '🛡️', title: 'AI Scam Detection', desc: 'Instant analysis of suspicious links, messages & QR codes' },
              { icon: '📋', title: 'One-Click Complaints', desc: 'Auto-generate NCRP-ready cybercrime complaint documents' },
              { icon: '🗺️', title: 'Live District Heatmap', desc: 'Real-time cyber crime risk map across Madhya Pradesh' },
              { icon: '🆘', title: 'Emergency SOS', desc: 'Instant connection to nearest cyber police station' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="text-xs font-bold text-white/70">{title}</p>
                  <p className="text-[11px] text-white/25 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
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

      {/* ── RIGHT PANEL — Signup Form ── */}
      <div
        className="w-full lg:w-[500px] flex flex-col items-center justify-center px-10 py-12 relative flex-shrink-0 overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #060e1e 0%, #050c1a 100%)' }}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.25), transparent)' }} />

        {/* Mobile brand */}
        <div className="lg:hidden mb-8 flex items-center justify-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="text-sm font-black text-white">SafeClick</p>
            <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">AI Guardian</p>
          </div>
        </div>

        <div className="w-full max-w-[380px] py-4">
          <SignupForm />
        </div>

        {/* Bottom credit */}
        <p className="absolute bottom-6 text-[10px] text-white/15 font-mono tracking-widest text-center">
          MP CYBER CRIME DIVISION · GOVT. OF INDIA
        </p>
      </div>
    </main>
  );
}
