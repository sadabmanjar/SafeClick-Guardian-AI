'use client';

import React, { useState } from 'react';
import { BookOpen, Trophy, Play, FileText, CheckCircle, ShieldCheck, HelpCircle, Award, Star, ArrowRight } from 'lucide-react';
import QuizModal from './QuizModal';
import CertificateViewer from './CertificateViewer';

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  completed: boolean;
  score?: number;
  description: string;
}

const courses: Course[] = [
  {
    id: 'crs-001',
    title: 'UPI Scams & Payment Traps',
    category: 'Financial Safety',
    duration: '15 mins',
    completed: true,
    description: 'Learn how malicious actors exploit UPI Collect requests, QR code scanning baits, and spoof apps to request money instead of sending it.',
  },
  {
    id: 'crs-002',
    title: 'Phishing Domain Interception',
    category: 'Web Security',
    duration: '20 mins',
    completed: true,
    description: 'Spot look-alike domains, zero-day subdomains, expired security certificates, and banking redirect spoof attempts.',
  },
  {
    id: 'crs-003',
    title: 'Predatory Loan Apps & Permissions',
    category: 'Mobile Defense',
    duration: '12 mins',
    completed: false,
    description: 'Protect your contacts list, photo vaults, and SMS inbox from excessive permissions requested by unverified credit lending utilities.',
  },
];

const articles = [
  { title: 'The Rise of SIM Swapping Fraud', readTime: '5 min read', category: 'Identity Theft' },
  { title: 'Securing Your Home Wi-Fi Routers', readTime: '7 min read', category: 'Network Defense' },
  { title: 'Anatomy of WhatsApp Job Scams', readTime: '4 min read', category: 'Social Engineering' },
];

const videos = [
  { title: 'Identifying Fake Customer Support Calls', duration: '3:45', category: 'Social Engineering' },
  { title: 'Understanding OTP Phishing Hijacks', duration: '5:12', category: 'Credentials Theft' },
];

export default function LearningScreen() {
  const [courseList, setCourseList] = useState<Course[]>(courses);
  const [quizOpen, setQuizOpen] = useState(false);
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [certOpen, setCertOpen] = useState(false);

  const completedCount = courseList.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / courseList.length) * 100);

  return (
    <div className="space-y-6 pb-24 lg:pb-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cyber Academy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build defensive knowledge, test your skills, and earn certified badges
          </p>
        </div>
        <div className="flex items-center gap-2">
          {certUnlocked ? (
            <button
              onClick={() => setCertOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-success/15 border border-success/35 text-success rounded-xl text-xs font-bold hover:bg-success/25 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse"
            >
              <Award size={14} /> View Certificate
            </button>
          ) : (
            <button
              onClick={() => setQuizOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(0,102,255,0.3)]"
            >
              <HelpCircle size={14} /> Take Quiz
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="glass-card border border-border p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Academy Progress</h3>
            <span className="text-xs font-bold text-primary">{progressPercent}% Completed</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {completedCount} of {courseList.length} core course modules finalized
            </p>
          </div>
        </div>

        {/* Badges Locker */}
        <div className="glass-card border border-border p-5 rounded-xl space-y-3 md:col-span-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Earned Guard Badges</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-success/20 bg-success/5 text-success text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> Phishing Inspector
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-success/20 bg-success/5 text-success text-[10px] font-bold uppercase tracking-wider">
              <Trophy size={14} /> UPI Guardian
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 bg-zinc-900 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
              <Star size={14} className="opacity-40" /> Android Defiler (Locked)
            </div>
          </div>
        </div>
      </div>

      {/* Modules list & sidebar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Interactive Core Courses</h3>
          </div>

          <div className="space-y-4">
            {courseList.map((course) => (
              <div
                key={course.id}
                className={`p-5 glass-card border rounded-2xl flex flex-col justify-between gap-4 transition-all duration-200 ${
                  course.completed ? 'border-success/20 bg-success/5' : 'border-border/60 hover:border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                      course.completed ? 'bg-success/15 border-success/35 text-success' : 'bg-primary/10 border-primary/20 text-primary'
                    }`}>
                      {course.category}
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-2">{course.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{course.description}</p>
                  </div>

                  {course.completed && (
                    <div className="p-1 rounded-full bg-success/20 border border-success/35 text-success flex-shrink-0">
                      <CheckCircle size={16} />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-[10px] font-mono text-muted-foreground">
                  <span>Estimated Duration: {course.duration}</span>
                  {!course.completed && (
                    <button className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
                      Launch Module <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles and Videos Sidebar */}
        <div className="space-y-6">
          {/* Quick reads articles */}
          <div className="glass-card border border-border p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <FileText size={16} className="text-cyan-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Academy Articles</h3>
            </div>
            
            <div className="space-y-3">
              {articles.map((art, idx) => (
                <div key={`art-${idx}`} className="p-3 bg-zinc-950/40 border border-border/50 rounded-lg hover:border-primary/25 cursor-pointer transition-colors text-xs space-y-1.5">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase font-mono">{art.category}</span>
                  <h4 className="font-semibold text-foreground truncate leading-snug">{art.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono">{art.readTime}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Videos */}
          <div className="glass-card border border-border p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <Play size={16} className="text-warning animate-pulse" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Academy Videos</h3>
            </div>

            <div className="space-y-3">
              {videos.map((vid, idx) => (
                <div key={`vid-${idx}`} className="p-3 bg-zinc-950/40 border border-border/50 rounded-lg hover:border-primary/25 cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-warning uppercase font-mono">{vid.category}</span>
                    <h4 className="font-semibold text-foreground truncate mt-0.5 leading-snug">{vid.title}</h4>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0 bg-zinc-900 border border-border/50 px-2 py-0.5 rounded">
                    {vid.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal Popup */}
      {quizOpen && (
        <QuizModal
          onClose={() => setQuizOpen(false)}
          onUnlockCertificate={() => setCertUnlocked(true)}
        />
      )}

      {/* Certificate Viewer Popup */}
      {certOpen && (
        <CertificateViewer
          onClose={() => setCertOpen(false)}
        />
      )}
    </div>
  );
}
