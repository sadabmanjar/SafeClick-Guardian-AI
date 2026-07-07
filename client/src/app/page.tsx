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

  // Animation variants (consistent duration below 300ms)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: 'easeOut' as const }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden font-sans">
      
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <AppLogo size={28} />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
                SafeClick <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">AI</span>
              </span>
              <span className="text-[9px] text-gray-400 font-mono tracking-wider font-semibold">GUARDIAN NODE</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-gray-500 uppercase tracking-wide">
            <a href="#features" className="hover:text-blue-600 transition-colors">Pillars</a>
            <a href="#process" className="hover:text-blue-600 transition-colors">Protocol</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Threat Index</a>
            <a href="#ai-modules" className="hover:text-blue-600 transition-colors">AI Engine</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wide">
              Sign In
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              Launch Console <ArrowRight size={12} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-gray-200 bg-white"
            >
              <div className="flex flex-col gap-4 px-6 py-6 text-sm font-semibold">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Pillars
                </a>
                <a
                  href="#process"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Protocol
                </a>
                <a
                  href="#stats"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Threat Index
                </a>
                <a
                  href="#ai-modules"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  AI Engine
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  FAQ
                </a>
                <hr className="border-gray-100" />
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center rounded-lg border border-gray-200 text-xs font-bold hover:bg-gray-50 text-gray-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/analyze"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm"
                  >
                    Launch Console
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          {/* Hackathon Entry Badge */}
          <motion.div variants={itemVariants} className="inline-flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100 bg-blue-50 text-blue-600 uppercase tracking-wider">
              <ShieldCheck size={12} className="animate-pulse" />
              National Cyber Security Hackathon Entry
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]"
          >
            Intercept Financial Threat Vectors with <span className="text-blue-600">AI Safety Intelligence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed font-medium"
          >
            SafeClick Guardian AI intercepts, scans, and neutralizes phishing attempts, fraudulent messages, and online financial threats in real time.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              Analyze Suspicious Scan <ArrowRight size={14} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-bold border border-gray-250 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Explore Pillars
            </a>
          </motion.div>

          {/* Core specs badges */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-10 text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono"
          >
            <div className="flex items-center justify-center gap-1.5 py-2.5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <Lock size={12} className="text-blue-600" />
              <span>Zero-Knowledge</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2.5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <Zap size={12} className="text-blue-600" />
              <span>&lt;200ms API Speed</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2.5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <Brain size={12} className="text-blue-600" />
              <span>Gemini Engine</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2.5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <Fingerprint size={12} className="text-blue-600" />
              <span>Local OCR Extraction</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard visual mockup */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-14 relative rounded-xl border border-gray-200 bg-white p-3 shadow-md max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-150 bg-gray-50/50 rounded-t-lg text-[10px] font-bold text-gray-400 font-mono">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="ml-1.5">SAFECLICK-CONSOLE-MP-V1.0</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 font-bold uppercase tracking-wider text-[8px]">SECURE CONNECTION</span>
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full rounded-b-lg bg-[#FAFAF8] overflow-hidden flex items-center justify-center p-6 border border-t-0 border-gray-100">
            {/* Minimal mockup container */}
            <div className="w-full max-w-2xl border border-gray-200 rounded-xl bg-white flex flex-col overflow-hidden shadow-xs text-left">
              <div className="h-10 border-b border-gray-150 bg-gray-50/50 px-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Scam Risk Assessment</span>
                <StatusBadge variant="high" label="High Threat Detected" dot />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-150 text-left">
                <div className="p-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Threat Text</h4>
                  <div className="p-2.5 bg-red-50/50 border border-red-100 rounded-lg text-[10px] font-semibold text-red-700">
                    <p className="font-bold">SMS Broadcast</p>
                    <p className="text-gray-500 mt-1 truncate">"Your SBI account is disabled. Log in to claim..."</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Evaluation</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-500">Confidence:</span>
                      <span className="text-red-600">94% Phishing</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-[94%]" />
                    </div>
                    <p className="text-[9px] text-gray-400 leading-snug font-medium">Domain spoofing indicators detected on suspicious site.</p>
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions Available</h4>
                    <span className="inline-flex text-[8px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mt-1">
                      Report Package Ready
                    </span>
                    <p className="text-[9px] text-gray-400 mt-1 leading-snug font-medium">Police-compliant complaint report generated locally with evidence packet.</p>
                  </div>
                  <button className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 text-[10px] rounded-lg transition-colors font-bold mt-2">
                    Download Complaint Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. CORE SHIELD PILLARS (FEATURES) */}
      <section id="features" className="py-20 border-t border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-[10px] font-bold tracking-widest text-blue-600 uppercase font-mono">Defensive Architecture</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Five Pillars of Citizen Protection</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-medium">
            SafeClick delivers integrated, multi-vector shielding designed to defend and assist victims of cyber fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Brain size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">AI Scam Scanner</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                  Paste suspicious URLs, SMS text, or upload screenshots of chat conversations. Our OCR extracts details and Gemini evaluates threats.
                </p>
              </div>
            </div>
            <Link href="/analyze" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline mt-6">
              Launch Scanner <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs hover:shadow-md hover:border-red-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Emergency SOS Mode</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                  Under attack? Trigger SOS mode to lock down financial apps, notify pre-configured trusted contacts, and execute defensive checklist steps.
                </p>
              </div>
            </div>
            <Link href="/emergency" className="inline-flex items-center gap-1.5 text-xs text-red-600 font-bold hover:underline mt-6">
              Lock Down System <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs hover:shadow-md hover:border-green-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Complaint Generator</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                  Auto-generate legal complaint reports formatted exactly for cyber cell portals. Saves time during critical post-incident hours.
                </p>
              </div>
            </div>
            <Link href="/complaint" className="inline-flex items-center gap-1.5 text-xs text-green-600 font-bold hover:underline mt-6">
              Draft Complaint <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Threat Heatmap</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                  Visualize active scam hotspots and coordinate reports dynamically. Track phishing clusters in your region and avoid danger zones.
                </p>
              </div>
            </div>
            <Link href="/heatmap" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:underline mt-6">
              View Threat Map <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <GraduationCap size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Cyber Academy</h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                  Take modules on identifying UPI traps, bank phishing, social media spoofing, and secure credentials management.
                </p>
              </div>
            </div>
            <Link href="/learning" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline mt-6">
              Start Learning <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pillar 6 */}
          <div className="border border-dashed border-gray-300 p-5 rounded-xl flex flex-col justify-center items-center text-center space-y-2.5">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <Check size={14} />
            </div>
            <h4 className="text-xs font-bold text-gray-700">Additional Safeguards Active</h4>
            <p className="text-[11px] text-gray-400 leading-normal max-w-xs font-medium">
              Autonomous safety crawlers are updating reputation indexes for bank subdomains hourly.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="process" className="py-20 border-t border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-[10px] font-bold tracking-widest text-blue-600 uppercase font-mono">PIPELINE PROTOCOL</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">How SafeClick Protects</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-medium">
              Our end-to-end threat detection pipelines process messages and secure reports in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="bg-white border border-gray-250 p-6 rounded-xl shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-mono text-xs text-blue-600 font-bold">
                01
              </div>
              <h4 className="text-sm font-bold text-gray-900">Extract Details (OCR)</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Upload raw message text, link URLs, or screenshot images. The platform's local OCR pipeline extracts structured texts instantly, keeping images private.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-250 p-6 rounded-xl shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-mono text-xs text-blue-600 font-bold">
                02
              </div>
              <h4 className="text-sm font-bold text-gray-900">AI Verification Engine</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                The Gemini AI Engine analyzes wording tone, domain reputations, threat signatures, and heuristics to flag risk scores and list deception tactics.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-250 p-6 rounded-xl shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-mono text-xs text-blue-600 font-bold">
                03
              </div>
              <h4 className="text-sm font-bold text-gray-900">Incident Containment</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Instantly view the risk report. Lock down finances in SOS mode, download a pre-packaged legal complaint report, or visualize threats on the community map.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CYBER STATISTICS */}
      <section id="stats" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase font-mono">THREAT INDEX</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
              The Rapid Rise of Cyber Fraud
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
              Global online scam networks utilize automated bots and social manipulation to hijack financial accounts. Victim containment speed is crucial to preventing critical losses.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-red-50 border border-red-100 text-red-600 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">90% Rise in Spoofing Attacks</h4>
                  <p className="text-xs text-gray-500 font-medium">Mobile messaging and WhatsApp spoof accounts mimic legitimate government banks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-red-50 border border-red-100 text-red-600 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Golden Hours Containment</h4>
                  <p className="text-xs text-gray-500 font-medium">Taking recovery steps inside the first 2 hours yields an 85% higher financial recovery success rate.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-[#FAFAF8] border border-gray-200 rounded-xl text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600">$10B+</p>
              <p className="text-[10px] font-bold uppercase text-gray-400">Lost to scams annually</p>
            </div>
            <div className="p-5 bg-[#FAFAF8] border border-gray-200 rounded-xl text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">2.4M</p>
              <p className="text-[10px] font-bold uppercase text-gray-400">Phishing cases reported</p>
            </div>
            <div className="p-5 bg-[#FAFAF8] border border-gray-200 rounded-xl text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">&lt;1s</p>
              <p className="text-[10px] font-bold uppercase text-gray-400">Lockdown Speed</p>
            </div>
            <div className="p-5 bg-[#FAFAF8] border border-gray-200 rounded-xl text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 font-semibold">94.7%</p>
              <p className="text-[10px] font-bold uppercase text-gray-400">Detection accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI CORE MODULES */}
      <section id="ai-modules" className="py-20 border-t border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-[10px] font-bold tracking-widest text-blue-600 uppercase font-mono">INTELLIGENCE STACK</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Our AI Engine Architecture</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-medium">
              Our system runs a combination of local OCR tools, heuristic scoring, and Gemini NLP processors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module 1 */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Brain size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Gemini Prompt Heuristics</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                  Utilizes advanced prompt models to evaluate text urgency, fake authority figures, spoof banking indicators, and psychological manipulation vectors.
                </p>
              </div>
            </div>

            {/* Module 2 */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Server size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Tesseract OCR Pipeline</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                  Client-side OCR processing extracts phone numbers, URLs, transaction IDs, and names directly from WhatsApp/SMS screenshots without server file storage.
                </p>
              </div>
            </div>

            {/* Module 3 */}
            <div className="p-5 bg-white border border-gray-200 rounded-xl space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <BarChart3 size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Reputation API Scoring</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                  Performs domain checks, DNS routing lookup, and spam registry validations to verify link integrity and isolate zero-day phishing sites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-[10px] font-bold tracking-widest text-blue-600 uppercase font-mono">INQUIRIES</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={`faq-${index}`}
                className="border border-gray-200 bg-white rounded-lg overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <HelpCircle size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-1.5 text-xs text-gray-500 leading-relaxed font-medium border-t border-gray-100">
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
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="relative rounded-xl border border-blue-100 bg-blue-50/20 overflow-hidden px-8 py-14 text-center space-y-5">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 max-w-lg mx-auto">
            Secure Your Assets Against Automated Cyber Fraud
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-semibold">
            Get instant scans, emergency lock protocols, and legal complaint files generated in seconds.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              Start Free Scan <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-semibold text-gray-400">
          <div className="flex items-center gap-3">
            <AppLogo size={24} />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-800 tracking-tight">SafeClick Guardian AI</span>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Threat Containment Node</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="#features" className="hover:text-gray-900 transition-colors uppercase tracking-wide">Pillars</a>
            <a href="#process" className="hover:text-gray-900 transition-colors uppercase tracking-wide">Protocol</a>
            <a href="#stats" className="hover:text-gray-900 transition-colors uppercase tracking-wide">Threat Index</a>
            <a href="#ai-modules" className="hover:text-gray-900 transition-colors uppercase tracking-wide">AI Core</a>
          </div>

          <div className="text-[10px] font-mono">
            &copy; 2026 SafeClick. National Cyber Security Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}