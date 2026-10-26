'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Bell, Shield, LogOut, Sparkles, Newspaper, ChevronRight } from 'lucide-react';
import { EACAppointment, SMSLog, Patient } from '../lib/types';

interface PatientDashboardProps {
  patient: Patient;
  appointments: EACAppointment[];
  smsLogs: SMSLog[];
  onLogout: () => void;
  onRequestReschedule: (appointmentId: string) => void;
}

const healthUpdates = [
  "Tip: Consistent daily medication adherence improves viral suppression rates significantly.",
  "Clinic Update: New weekend check-in slots are now available for booking.",
  "Wellness Reminder: Stay hydrated and keep your clinic appointments on schedule!"
];

export default function PatientDashboard({
  patient,
  appointments,
  smsLogs,
  onLogout,
  onRequestReschedule
}: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'notifications'>('schedule');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  // Rotate news ticker every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % healthUpdates.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientLogs = smsLogs.filter(l => l.patientId === patient.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-0">
      {/* Top Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl border border-blue-500/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base sm:text-lg tracking-tight">Patient Portal</h1>
            <p className="text-xs text-slate-400">Welcome back, <span className="text-slate-200 font-semibold">{patient.fullName}</span> ({patient.nupn})</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 px-3.5 py-2 bg-slate-800/60 hover:bg-red-500/10 rounded-xl transition border border-slate-700/50 cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Exit
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Dynamic News & Updates Banner */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
          <Newspaper className="h-5 w-5 text-blue-400 shrink-0 ml-1" />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Health Update</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-300 transition-all duration-500 truncate font-medium">
                {healthUpdates[currentNewsIndex]}
              </span>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-md border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-blue-200" /> Counseling Stage: {patient.currentStage}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-3 tracking-tight">Enhanced Adherence Program</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1.5 max-w-lg leading-relaxed">
                Stay updated with your scheduled appointments and neutral check-in reminders securely.
              </p>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl text-center backdrop-blur-md shrink-0 border border-white/10">
              <p className="text-[10px] uppercase text-blue-200 font-bold tracking-wider">Privacy Status</p>
              <p className="text-sm font-extrabold text-emerald-400 mt-0.5 flex items-center justify-center gap-1.5">
                <Shield className="h-4 w-4" /> Protected
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="space-y-6">
          
          {/* Upcoming Appointments Section */}
          <div className={`space-y-4 ${activeTab === 'notifications' ? 'hidden md:block' : 'block'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" /> My Upcoming Appointments
              </h3>
            </div>

            {patientAppointments.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
                <Calendar className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-sm font-medium">No upcoming appointments currently scheduled.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patientAppointments.map(apt => (
                  <div key={apt.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-white text-sm">{apt.stage} Check-in</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          apt.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          apt.status === 'Attended' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-blue-400" /> {apt.scheduledDate} at {apt.scheduledTime}
                      </p>
                    </div>

                    <button 
                      onClick={() => onRequestReschedule(apt.id)}
                      className="text-xs font-bold text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 px-4 py-2.5 rounded-xl transition self-start sm:self-auto cursor-pointer flex items-center gap-1"
                    >
                      Request Reschedule <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Inbox Section */}
          <div className={`space-y-4 ${activeTab === 'schedule' ? 'hidden md:block' : 'block'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-400" /> Received Neutral Reminders
              </h3>
            </div>

            {patientLogs.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
                <Bell className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-sm font-medium">No recent SMS reminders logged.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patientLogs.map(log => (
                  <div key={log.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-sm">
                    <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                      <span className="text-purple-400 font-semibold">SMS Notification Dispatch</span>
                      <span>{log.sentAt}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">"{log.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Responsive Bottom Navigation Bar (Visible on mobile screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 p-2 z-40 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition cursor-pointer ${
            activeTab === 'schedule' ? 'text-blue-400 bg-blue-600/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] font-bold">Appointments</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition cursor-pointer relative ${
            activeTab === 'notifications' ? 'text-purple-400 bg-purple-600/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="h-5 w-5" />
          <span className="text-[10px] font-bold">Notifications</span>
          {patientLogs.length > 0 && (
            <span className="absolute top-1.5 right-5 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}