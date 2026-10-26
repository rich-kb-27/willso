'use client';

import React, { useEffect } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    // Automatically transition to the Login Screen after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-between p-6 text-center select-none relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Spacer */}
      <div className="h-4" />

      {/* Center Logo & Branding */}
      <div className="flex flex-col items-center space-y-6 max-w-sm z-10">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-blue-500/20 animate-ping" />
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-6 rounded-3xl shadow-2xl relative z-10 border border-blue-400/30">
            <Activity className="h-16 w-16 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            EAC<span className="text-blue-500">Care</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
            Enhanced Adherence Counseling & Privacy-Preserving Patient Reminders
          </p>
        </div>
      </div>

      {/* Bottom Status Indicator */}
      <div className="flex flex-col items-center space-y-4 z-10 mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-4 py-2 rounded-full border border-blue-800/50 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          Securing Clinical Workspace...
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Encrypted & Neutral SMS Compliant
        </div>
      </div>
    </div>
  );
}