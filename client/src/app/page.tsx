'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  FileText,
  MapPin,
  GraduationCap,
  ArrowRight,
  Menu,
  X,
  Lock,
  Zap,
  HelpCircle,
  Check,
  Brain,
  Sparkles,
  BarChart3,
  Server,
  Fingerprint
} from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import StatusBadge from '@/components/ui/StatusBadge';

// FAQ Items
const faqs = [
  {
    q: "How does the AI Scam Analyzer evaluate links and text?",
    a: "Our system combines Google Gemini LLM intelligence, heuristics, and domain reputation databases. It scans the input content for phishing patterns, high-pressure language, deceptive links, and matches screenshots using Tesseract OCR to flag fraudulent WhatsApp, Telegram, or SMS threads."
  },
  {
    q: "Is my personal data safe with SafeClick Guardian?",
    a: "Absolutely. SafeClick operates on a privacy-first protocol. All content scanned is analyzed in memory, and we do not store screenshots or personal identification information (PII) on our servers unless you explicitly choose to save it to your Evidence Locker."
  },
  {
    q: "What does the Emergency SOS mode do?",
    a: "Emergency SOS mode triggers an immediate lock-down protocol. It gives you an instant checklist of defensive actions, auto-notifies your pre-configured trusted contacts with your safety status, and helps you immediately route details to cybercrime cells."
  },
  {
    q: "Does the Complaint Generator automatically file reports?",
    a: "It drafts a comprehensive, legal-ready complaint document in the exact format required by law enforcement (such as India's National Cyber Crime portal). It packages your transaction logs, screenshots, and suspect details so you can download and file them in one click."
  },
  {
    q: "How is the Scam Heatmap kept up to date?",
    a: "The heatmap dynamically updates based on anonymous reports validated by our system and verified law enforcement feeds. This helps visualize active scam clusters and regional phishing campaigns in real time."
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background Decorative Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[1000px] left-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080f25_1px,transparent_1px),linear-gradient(to_bottom,#080f25_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                SafeClick <span className="text-[10px] bg-primary/20 border border-primary/30 text-primary px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">AI</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">GUARDIAN SYSTEM</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#process" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-cyan-400 transition-colors">Threat Feed</a>
            <a href="#ai-modules" className="hover:text-cyan-400 transition-colors">AI Core</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-all"
            >
              Launch Platform <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-border/50 bg-black/95 backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-4 px-6 py-8">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-muted-foreground hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#process"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-muted-foreground hover:text-white"
                >
                  How It Works
                </a>
                <a
                  href="#stats"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-muted-foreground hover:text-white"
                >
                  Threat Feed
                </a>
                <a
                  href="#ai-modules"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-muted-foreground hover:text-white"
                >
                  AI Core
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-muted-foreground hover:text-white"
                >
                  FAQ
                </a>
                <hr className="border-border/40" />
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-lg border border-border text-sm font-semibold hover:bg-muted"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/analyze"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                  >
                    Launch Platform
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <ShieldCheck size={13} className="animate-pulse" />
              National Cyber Security Hackathon Entry
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[1.1]"
          >
            Defend Your Digital Space With <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI Threat Intelligence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            SafeClick Guardian AI intercepts, scans, and neutralizes phishing attempts, fraudulent messages, and online financial threats in real time.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all duration-200"
            >
              Analyze Suspicious Scan <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold border border-border bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              Explore Shield Pillars
            </a>
          </motion.div>

          {/* Security Features Badges */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12 text-sm font-mono text-muted-foreground"
          >
            <div className="flex items-center justify-center gap-2 px-3 py-2 glass-card rounded-lg border border-border/40">
              <Lock size={14} className="text-cyan-400" />
              <span>Zero-Knowledge Policy</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-2 glass-card rounded-lg border border-border/40">
              <Zap size={14} className="text-cyan-400" />
              <span>&lt;200ms Processing</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-2 glass-card rounded-lg border border-border/40">
              <Brain size={14} className="text-cyan-400" />
              <span>Gemini LLM Engine</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-2 glass-card rounded-lg border border-border/40">
              <Fingerprint size={14} className="text-cyan-400" />
              <span>Local OCR Extraction</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 relative rounded-2xl border border-border/40 bg-zinc-950/80 p-3 shadow-[0_0_50px_rgba(0,102,255,0.15)] max-w-5xl mx-auto group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/40 bg-zinc-900/50 rounded-t-xl text-xs font-mono text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2">safeclick-guardian-terminal-v1.0.exe</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-success font-semibold">AI ACTIVE</span>
          </div>
          <div className="relative aspect-[16/9] w-full rounded-b-xl bg-black overflow-hidden flex items-center justify-center p-6 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_70%)] pointer-events-none" />
            
            {/* Mock Dashboard Layout */}
            <div className="w-full h-full border border-primary/20 rounded-xl bg-zinc-950/50 flex flex-col overflow-hidden font-sans">
              <div className="h-12 border-b border-border/50 bg-black/60 px-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">SCAM THREAT ANALYZER</span>
                <StatusBadge variant="high" label="High Threat Detected" dot />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50 text-left">
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Threat Source</h4>
                  <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-xs font-mono">
                    <p className="text-red-400 font-bold">SMS / WhatsApp Message</p>
                    <p className="text-muted-foreground mt-1 truncate">"Your bank account is locked. Reactivate at secure-link.net..."</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">AI Evaluation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Confidence Score:</span>
                      <span className="text-danger font-bold">94% Scam</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-danger w-[94%]" />
                    </div>
                    <p className="text-[10px] text-muted-foreground">High threat profile matching standard banking spoofing attacks.</p>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Automated Incident Action</h4>
                    <span className="inline-flex text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded font-mono mb-2">
                      POLICE DRAFT READY
                    </span>
                    <p className="text-xs text-muted-foreground">Legal complaint draft generated containing metadata and screenshots.</p>
                  </div>
                  <button className="w-full py-2 bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary text-xs rounded-lg transition-colors font-semibold">
                    Download Complaint Packet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. CORE SHIELD PILLARS (FEATURES) */}
      <section id="features" className="py-20 border-t border-border/30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-sm font-semibold font-mono tracking-widest text-primary uppercase">DEFENSIVE SUITE</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Five Pillars of Cyber Protection</h3>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            SafeClick delivers integrated, multi-vector shielding designed to defend and assist victims of cyber fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card border border-border/40 p-6 rounded-2xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Brain size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground">AI Scam Scanner</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste suspicious URLs, SMS text, or upload screenshots of chat conversations. Our OCR extracts details and Gemini evaluates threats.
              </p>
            </div>
            <Link href="/analyze" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-6">
              Launch Scanner <ArrowRight size={12} />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="glass-card border border-border/40 p-6 rounded-2xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                <AlertTriangle size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground">Emergency SOS Mode</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Under attack? Trigger SOS mode to lock down financial apps, notify pre-configured trusted contacts, and execute defensive checklist steps.
              </p>
            </div>
            <Link href="/emergency-mode" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-6">
              Lock Down System <ArrowRight size={12} />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="glass-card border border-border/40 p-6 rounded-2xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <FileText size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground">Complaint Generator</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Auto-generate legal complaint reports formatted exactly for cyber cell portals. Saves time during critical post-incident hours.
              </p>
            </div>
            <Link href="/complaint-generator" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-6">
              Draft Complaint <ArrowRight size={12} />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="glass-card border border-border/40 p-6 rounded-2xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                <MapPin size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground">Threat Heatmap</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visualize active scam hotspots and coordinate reports dynamically. Track phishing clusters in your region and avoid danger zones.
              </p>
            </div>
            <Link href="/heatmap" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-6">
              View Threat Map <ArrowRight size={12} />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="glass-card border border-border/40 p-6 rounded-2xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <GraduationCap size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground">Cyber Academy</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take modules on identifying UPI traps, bank phishing, social media spoofing, and secure credentials management.
              </p>
            </div>
            <Link href="/learning" className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-6">
              Start Learning <ArrowRight size={12} />
            </Link>
          </div>

          {/* Feature 6 (Placeholder/Info card) */}
          <div className="border border-dashed border-border/60 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground">
              <Check size={16} />
            </div>
            <h4 className="text-sm font-semibold text-muted-foreground">More Modules Loading</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-normal">
              Continuous neural model training introduces automated SMS interceptors and voice phishing analyzers soon.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="process" className="py-20 bg-zinc-950/30 border-t border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-sm font-semibold font-mono tracking-widest text-primary uppercase">PIPELINE PROTOCOL</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">How SafeClick Protects</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Our end-to-end threat detection pipelines process messages and secure reports in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-4 text-center md:text-left relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-sm text-primary font-bold mb-4 mx-auto md:mx-0">
                01
              </div>
              <h4 className="text-base font-bold text-foreground">Extract Details (OCR)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload raw message text, link URLs, or screenshot images. The platform's local OCR pipeline extracts structured texts instantly, keeping images private.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center md:text-left relative">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono text-sm text-cyan-400 font-bold mb-4 mx-auto md:mx-0">
                02
              </div>
              <h4 className="text-base font-bold text-foreground">AI Verification Engine</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The Gemini AI Engine analyzes wording tone, domain reputations, threat signatures, and heuristics to flag risk scores and list deception tactics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center md:text-left relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-sm text-primary font-bold mb-4 mx-auto md:mx-0">
                03
              </div>
              <h4 className="text-base font-bold text-foreground">Incident Containment</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instantly view the risk report. Lock down finances in SOS mode, download a pre-packaged legal complaint report, or visualize threats on the community map.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CYBER STATISTICS */}
      <section id="stats" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold font-mono tracking-widest text-primary uppercase">THREAT INDEX</span>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              The Rapid Rise of Cyber Fraud
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Global online scam networks utilize automated bots and social manipulation to hijack financial accounts. Victim containment speed is crucial to preventing critical losses.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-danger/10 border border-danger/20 text-danger mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">90% Rise in Spoofing Attacks</h4>
                  <p className="text-xs text-muted-foreground">Mobile messaging and WhatsApp spoof accounts mimic legitimate government banks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-danger/10 border border-danger/20 text-danger mt-0.5">
                  <Check size={14} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Golden Hours Containment</h4>
                  <p className="text-xs text-muted-foreground">Taking recovery steps inside the first 2 hours yields an 85% higher financial recovery success rate.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 glass-card border border-border/40 rounded-2xl text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400">$10B+</p>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Lost to scams annually</p>
            </div>
            <div className="p-6 glass-card border border-border/40 rounded-2xl text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-primary">2.4M</p>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Phishing cases reported</p>
            </div>
            <div className="p-6 glass-card border border-border/40 rounded-2xl text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-primary">&lt;1s</p>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Emergency Lockdown Speed</p>
            </div>
            <div className="p-6 glass-card border border-border/40 rounded-2xl text-center space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400">94.7%</p>
              <p className="text-xs font-semibold uppercase text-muted-foreground">AI detection accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI CORE MODULES */}
      <section id="ai-modules" className="py-20 bg-zinc-950/20 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-sm font-semibold font-mono tracking-widest text-primary uppercase">INTELLIGENCE STACK</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Our AI Engine Architecture</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Our system runs a combination of local OCR tools, heuristic scoring, and Gemini NLP processors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module 1 */}
            <div className="p-6 glass-card border border-border/40 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Brain size={18} />
              </div>
              <h4 className="text-base font-bold text-foreground">Gemini Prompt Heuristics</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Utilizes advanced prompt models to evaluate text urgency, fake authority figures, spoof banking indicators, and psychological manipulation vectors.
              </p>
            </div>

            {/* Module 2 */}
            <div className="p-6 glass-card border border-border/40 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Server size={18} />
              </div>
              <h4 className="text-base font-bold text-foreground">Tesseract OCR Pipeline</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Client-side OCR processing extracts phone numbers, URLs, transaction IDs, and names directly from WhatsApp/SMS screenshots without server file storage.
              </p>
            </div>

            {/* Module 3 */}
            <div className="p-6 glass-card border border-border/40 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BarChart3 size={18} />
              </div>
              <h4 className="text-base font-bold text-foreground">Reputation API Scoring</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Performs domain checks, DNS routing records lookup, and spam registry validations to verify link integrity and isolate zero-day phishing sites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-sm font-semibold font-mono tracking-widest text-primary uppercase">INQUIRIES</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={`faq-${index}`}
                className="border border-border/40 bg-zinc-950/60 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-foreground hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <HelpCircle size={16} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CALL TO ACTION (CTA) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="relative rounded-3xl border border-primary/30 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.15)_0%,transparent_80%)] overflow-hidden px-8 py-16 sm:px-16 text-center space-y-6">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-xl mx-auto leading-tight">
            Secure Your Assets Against Automated Cyber Fraud
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Get instant scans, emergency lock protocols, and legal complaint files generated in seconds.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_20px_rgba(0,102,255,0.4)] transition-all duration-200"
            >
              Start Free AI Scam Scan <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-border/30 bg-black/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <AppLogo size={28} />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white tracking-tight">SafeClick Guardian AI</span>
              <span className="text-[9px] font-mono text-muted-foreground uppercase">Threat Containment System</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#process" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Threat Index</a>
            <a href="#ai-modules" className="hover:text-foreground transition-colors">AI Core</a>
          </div>

          <div className="text-xs font-mono">
            &copy; 2026 SafeClick. Hackathon Security Project.
          </div>
        </div>
      </footer>
    </div>
  );
}