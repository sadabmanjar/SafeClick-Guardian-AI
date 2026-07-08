'use client';

import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "A message from your bank claims your account is locked and includes a link to reactivate it. What should you do?",
    options: [
      "Click the link immediately to prevent account closure",
      "Ignore the message, and call the bank's official number to verify",
      "Reply to the message requesting more verification details",
      "Click the link and input only your username, not the password"
    ],
    correct: 1,
    explanation: "Banks never send SMS links asking you to reactivate accounts. Always verify via the bank's official website or customer helpline directly."
  },
  {
    id: 2,
    text: "You receive an unsolicited UPI payment request from a stranger claiming it was sent 'by mistake'. What is the safest action?",
    options: [
      "Decline the request immediately and do NOT authorize any PIN entries",
      "Accept the request and refund the money through the app",
      "Send a message demanding transaction logs",
      "Enter your UPI PIN to approve refunding the transaction"
    ],
    correct: 0,
    explanation: "UPI request scams lure you into entering your UPI PIN. Your UPI PIN is only required to SEND/AUTHORIZE money, never to receive it."
  },
  {
    id: 3,
    text: "Which of the following describes a strong passkey habit?",
    options: [
      "Using the same password with minor suffix changes across domains",
      "Storing passwords in a local plaintext doc file",
      "Using unique, complex phrases and enabling multi-factor authenticator codes",
      "Writing passwords on sticky notes attached to your screen"
    ],
    correct: 2,
    explanation: "Strong credentials require high complexity, unique phrases per service, and mandatory Multi-Factor Authentication (MFA) overlays."
  }
];

interface QuizModalProps {
  onClose: () => void;
  onUnlockCertificate: () => void;
}

export default function QuizModal({ onClose, onUnlockCertificate }: QuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestion = quizQuestions[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    // Tally score
    if (selectedOpt === activeQuestion.correct) {
      setScore((prev) => prev + 1);
    }

    setIsAnswered(false);
    setSelectedOpt(null);

    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    setIsAnswered(true);
  };

  const handleCompleteQuiz = () => {
    const finalScore = score + (selectedOpt === activeQuestion.correct ? 1 : 0);
    if (finalScore >= 2) {
      onUnlockCertificate();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/35 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 space-y-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600 animate-pulse" />
            <span className="text-sm font-bold text-gray-900">Cyber Guard Security Quiz</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {!quizFinished ? (
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-bold font-mono text-gray-400 uppercase">
              <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
              <span>Passing: 2/3 Correct</span>
            </div>

            <h4 className="text-sm font-bold text-gray-900 leading-snug">{activeQuestion.text}</h4>

            {/* Options list */}
            <div className="space-y-2 pt-2">
              {activeQuestion.options.map((opt, i) => {
                let optionStyle = 'border-gray-200 bg-white text-gray-600 hover:border-blue-500/40 hover:text-gray-900 font-semibold';
                
                if (selectedOpt === i) {
                  optionStyle = 'border-blue-600 bg-blue-50/50 text-blue-600 font-bold';
                }

                if (isAnswered) {
                  if (i === activeQuestion.correct) {
                    optionStyle = 'border-green-200 bg-green-50 text-green-700 font-bold';
                  } else if (selectedOpt === i) {
                    optionStyle = 'border-rose-200 bg-rose-50 text-rose-600 font-bold';
                  } else {
                    optionStyle = 'border-gray-100 text-gray-400 cursor-not-allowed';
                  }
                }

                return (
                  <button
                    key={`opt-${i}`}
                    onClick={() => handleOptionSelect(i)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 border rounded-lg text-xs text-left transition-all leading-normal ${optionStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-500 leading-relaxed font-semibold">
                <strong className="text-gray-900">AI Review:</strong> {activeQuestion.explanation}
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 flex justify-end">
              {!isAnswered ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700 transition-all pt-0 pb-0 shadow-sm"
                >
                  Confirm Answer <ArrowRight size={14} />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-blue-700 transition-all pt-0 pb-0 shadow-sm"
                >
                  {currentIdx < quizQuestions.length - 1 ? 'Next Question' : 'Evaluate Results'} <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700 mb-2">
              <CheckCircle size={24} className="animate-pulse" />
            </div>
            
            <h4 className="text-lg font-bold text-gray-900">Cyber Assessment Evaluation</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed font-semibold">
              Assessment finished. You answered <strong className="text-gray-900">{score} of {quizQuestions.length}</strong> questions correctly.
            </p>

            <div className="pt-4 flex gap-3">
              <Button
                onClick={handleCompleteQuiz}
                className="flex-1 h-11 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all pt-0 pb-0 shadow-sm"
              >
                {score >= 2 ? 'Unlock Certificate & Return' : 'Close Assessment'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
