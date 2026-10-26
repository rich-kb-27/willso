'use client';

import React, { useState } from 'react';
import { Activity, Lock, UserCheck, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: { name: string; role: 'admin' | 'patient'; id?: string }) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [role, setRole] = useState<'admin' | 'patient'>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API authentication delay
    setTimeout(() => {
      setIsLoading(false);

      if (role === 'admin') {
        onLoginSuccess({
          name: 'Clinic Officer Admin',
          role: 'admin'
        });
      } else {
        onLoginSuccess({
          name: identifier || 'Chileshe Mwape',
          role: 'patient',
          id: identifier || 'PTH-9021'
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-x-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 sm:h-96 bg-gradient-to-b from-blue-600/15 to-transparent pointer-events-none" />

      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 my-auto">
        {/* Top Banner */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white text-center relative">
          <div className="inline-flex p-3.5 bg-blue-600/20 text-blue-400 rounded-2xl mb-3 border border-blue-500/20">
            <Activity className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">EAC System Access</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your clinical management portal</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setIdentifier('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                role === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Clinical Staff
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('patient');
                setIdentifier('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                role === 'patient'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Patient Check-In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'admin' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Staff Username / Email
                  </label>
                  <div className="relative">
                    <UserCheck className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. nurse_admin"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 sm:py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 sm:py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Hospital ID (NUPN) or Registered Phone
                  </label>
                  <div className="relative">
                    <Shield className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. PTH-9021 or +260..."
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 sm:py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                  <span>Enter your patient ID or phone number to check upcoming EAC appointment dates.</span>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 sm:py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Credentials...
                </span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}