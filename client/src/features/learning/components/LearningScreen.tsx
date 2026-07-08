'use client';

import React, { useState } from 'react';
import { BookOpen, Trophy, Play, FileText, CheckCircle, ShieldCheck, HelpCircle, Award, Star, ArrowRight } from 'lucide-react';
import QuizModal from './QuizModal';
import CertificateViewer from './CertificateViewer';
import PageHeader from '@/components/ui/PageHeader';

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
    <div className="space-y-6 pb-24 lg:pb-8 text-left text-gray-900">
      <PageHeader
        title="Cyber Academy"
        subtitle="Build defensive knowledge, test your skills, and earn certified badges"
        actions={
          <div className="flex items-center gap-2">
            {certUnlocked ? (
              <button
                onClick={() => setCertOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-all shadow-sm"
              >
                <Award size={14} /> View Certificate
              </button>
            ) : (
              <button
                onClick={() => setQuizOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm animate-pulse"
              >
                <HelpCircle size={14} /> Take Quiz
              </button>
            )}
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-4 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academy Progress</h3>
            <span className="text-xs font-bold text-blue-600">{progressPercent}% Completed</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-[10px] text-gray-400 font-semibold">
              {completedCount} of {courseList.length} core course modules finalized
            </p>
          </div>
        </div>

        {/* Badges Locker */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-3 md:col-span-2 shadow-xs">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Earned Guard Badges</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck size={14} /> Phishing Inspector
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider">
              <Trophy size={14} /> UPI Guardian
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
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
            <BookOpen size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Interactive Core Courses</h3>
          </div>

          <div className="space-y-4">
            {courseList.map((course) => (
              <div
                key={course.id}
                className={`p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-200 border ${
                  course.completed ? 'border-green-200 bg-green-50/40' : 'bg-white border-gray-200 hover:border-blue-500/30 shadow-xs hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                      course.completed ? 'bg-green-100 border-green-200 text-green-700' : 'bg-blue-50 border-blue-100 text-blue-600'
                    }`}>
                      {course.category}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 mt-2">{course.title}</h4>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-semibold">{course.description}</p>
                  </div>

                  {course.completed && (
                    <div className="p-1 rounded-full bg-green-100 border border-green-200 text-green-700 flex-shrink-0">
                      <CheckCircle size={16} />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] font-semibold font-mono text-gray-400">
                  <span>Estimated Duration: {course.duration}</span>
                  {!course.completed && (
                    <button className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline">
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
          <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText size={16} className="text-blue-500" />
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academy Articles</h3>
            </div>
            
            <div className="space-y-3">
              {articles.map((art, idx) => (
                <div key={`art-${idx}`} className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500/25 cursor-pointer transition-colors text-xs space-y-1.5">
                  <span className="text-[9px] font-bold text-blue-600 uppercase font-mono">{art.category}</span>
                  <h4 className="font-bold text-gray-900 truncate leading-snug">{art.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold font-mono">{art.readTime}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Videos */}
          <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Play size={16} className="text-amber-500" />
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Academy Videos</h3>
            </div>

            <div className="space-y-3">
              {videos.map((vid, idx) => (
                <div key={`vid-${idx}`} className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-500/25 cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-amber-600 uppercase font-mono">{vid.category}</span>
                    <h4 className="font-bold text-gray-900 truncate mt-0.5 leading-snug">{vid.title}</h4>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold font-mono flex-shrink-0 bg-white border border-gray-200 px-2 py-0.5 rounded">
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
