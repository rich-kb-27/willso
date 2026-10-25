'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  PlusCircle, 
  Clock, 
  Search,
  CheckCircle,
  XCircle,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { Patient, EACAppointment, SMSLog } from './lib/types';
import { buildNeutralSMSMessage } from './lib/sms';

export default function EACDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'schedule' | 'attendance' | 'logs'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial Mock Data for Real Clinical Workflows
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'p1',
      nupn: 'PTH-9021',
      fullName: 'Chileshe Mwape',
      phoneNumber: '+260977123456',
      baselineViralLoad: 4500,
      currentStage: 'Session 1',
      consentFlag: true,
      createdAt: '2026-10-10'
    },
    {
      id: 'p2',
      nupn: 'PTH-4410',
      fullName: 'Bwalya Phiri',
      phoneNumber: '+260966987654',
      baselineViralLoad: 12000,
      currentStage: 'Session 2',
      consentFlag: true,
      createdAt: '2026-09-15'
    },
    {
      id: 'p3',
      nupn: 'PTH-1102',
      fullName: 'Mutale Banda',
      phoneNumber: '+260955333222',
      baselineViralLoad: 890,
      currentStage: 'Completed',
      consentFlag: true,
      createdAt: '2026-08-01'
    }
  ]);

  const [appointments, setAppointments] = useState<EACAppointment[]>([
    {
      id: 'apt1',
      patientId: 'p1',
      patientName: 'Chileshe Mwape',
      phoneNumber: '+260977123456',
      stage: 'Session 1',
      scheduledDate: '2026-10-28',
      scheduledTime: '09:00',
      status: 'Scheduled',
      reminderSent24h: true,
      reminderSent48h: true
    },
    {
      id: 'apt2',
      patientId: 'p2',
      patientName: 'Bwalya Phiri',
      phoneNumber: '+260966987654',
      stage: 'Session 2',
      scheduledDate: '2026-10-24',
      scheduledTime: '10:30',
      status: 'Missed',
      reminderSent24h: true,
      reminderSent48h: true
    }
  ]);

  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([
    {
      id: 'log1',
      patientId: 'p1',
      phoneNumber: '+260977123456',
      message: 'Hello Chileshe, this is a friendly reminder of your upcoming check-in appointment scheduled for 2026-10-28 at 09:00.',
      sentAt: '2026-10-26 08:30:00',
      status: 'DELIVERED'
    }
  ]);

  // Form States
  const [newPatient, setNewPatient] = useState({
    nupn: '',
    fullName: '',
    phoneNumber: '',
    baselineViralLoad: '',
    consentFlag: true
  });

  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    stage: 'Session 1' as const,
    scheduledDate: '',
    scheduledTime: '09:00'
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Handlers
  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.nupn || !newPatient.fullName || !newPatient.phoneNumber) return;

    const patient: Patient = {
      id: `p_${Date.now()}`,
      nupn: newPatient.nupn,
      fullName: newPatient.fullName,
      phoneNumber: newPatient.phoneNumber,
      baselineViralLoad: Number(newPatient.baselineViralLoad) || 0,
      currentStage: 'Session 1',
      consentFlag: newPatient.consentFlag,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPatients([patient, ...patients]);
    setNewPatient({ nupn: '', fullName: '', phoneNumber: '', baselineViralLoad: '', consentFlag: true });
    setActiveTab('patients');
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newAppointment.patientId);
    if (!patient || !newAppointment.scheduledDate) return;

    const appointment: EACAppointment = {
      id: `apt_${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      phoneNumber: patient.phoneNumber,
      stage: newAppointment.stage,
      scheduledDate: newAppointment.scheduledDate,
      scheduledTime: newAppointment.scheduledTime,
      status: 'Scheduled',
      reminderSent24h: false,
      reminderSent48h: false
    };

    setAppointments([appointment, ...appointments]);
    setActiveTab('schedule');
  };

  const handleTriggerManualSMS = async (appointment: EACAppointment) => {
    const message = buildNeutralSMSMessage(appointment.patientName, appointment.scheduledDate, appointment.scheduledTime);
    
    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: appointment.patientName,
          phoneNumber: appointment.phoneNumber,
          appointmentDate: appointment.scheduledDate,
          appointmentTime: appointment.scheduledTime
        })
      });

      if (res.ok) {
        const newLog: SMSLog = {
          id: `log_${Date.now()}`,
          patientId: appointment.patientId,
          phoneNumber: appointment.phoneNumber,
          message,
          sentAt: new Date().toLocaleString(),
          status: 'DELIVERED'
        };
        setSmsLogs([newLog, ...smsLogs]);
        alert(`Neutral SMS dispatched to ${appointment.phoneNumber}`);
      }
    } catch (err) {
      alert('Failed to send SMS trigger.');
    }
  };

  const handleUpdateStatus = (appointmentId: string, status: 'Attended' | 'Missed' | 'Rescheduled') => {
    setAppointments(appointments.map(apt => {
      if (apt.id === appointmentId) {
        if (status === 'Attended') {
          setPatients(patients.map(p => {
            if (p.id === apt.patientId) {
              const nextStage = apt.stage === 'Session 1' ? 'Session 2' : apt.stage === 'Session 2' ? 'Session 3' : 'Completed';
              return { ...p, currentStage: nextStage };
            }
            return p;
          }));
        }
        return { ...apt, status };
      }
      return apt;
    }));
  };

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.nupn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phoneNumber.includes(searchQuery)
  );

  const missedCount = appointments.filter(a => a.status === 'Missed').length;
  const scheduledCount = appointments.filter(a => a.status === 'Scheduled').length;

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Activity },
    { id: 'patients', label: 'Patient Records', icon: Users },
    { id: 'schedule', label: 'EAC Appointments', icon: Calendar },
    { id: 'attendance', label: 'Attendance & Follow-ups', icon: CheckCircle2, badge: missedCount },
    { id: 'logs', label: 'SMS Notifications Log', icon: MessageSquare }
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-slate-900 text-white flex items-center justify-between px-4 py-3 z-30 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-base">EAC Adherence</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-lg hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Backdrop overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="hidden md:flex items-center gap-3 px-2 py-4 border-b border-slate-800">
            <Activity className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">EAC Adherence</h1>
              <p className="text-xs text-slate-400">Patient Reminder System</p>
            </div>
          </div>

          <nav className="mt-4 md:mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 px-2 mt-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="truncate">Gateway: Twilio SMS Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Clinical Dashboard</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Enhanced Adherence Counseling tracking & automated reminder engine.</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Active Patients</p>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">{patients.length}</p>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="h-5 w-5" /></div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Upcoming EAC Sessions</p>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">{scheduledCount}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Calendar className="h-5 w-5" /></div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Missed Sessions (Flagged)</p>
                    <p className="text-xl sm:text-2xl font-extrabold text-red-600 mt-1">{missedCount}</p>
                  </div>
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="h-5 w-5" /></div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Dispatched Reminders</p>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">{smsLogs.length}</p>
                  </div>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MessageSquare className="h-5 w-5" /></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-blue-600 shrink-0" /> Quick Register Patient
                </h3>
                <form onSubmit={handleRegisterPatient} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Patient Hospital Number / NUPN</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PTH-8841"
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPatient.nupn}
                      onChange={e => setNewPatient({ ...newPatient, nupn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPatient.fullName}
                      onChange={e => setNewPatient({ ...newPatient, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Phone Number (SMS Notifications)</label>
                    <input
                      type="text"
                      required
                      placeholder="+260..."
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPatient.phoneNumber}
                      onChange={e => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">Baseline Viral Load (copies/mL)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPatient.baselineViralLoad}
                      onChange={e => setNewPatient({ ...newPatient, baselineViralLoad: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition">
                    Register & Start EAC Workflow
                  </button>
                </form>
              </div>

              {/* Schedule Form */}
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600 shrink-0" /> Book EAC Session
                </h3>
                <form onSubmit={handleCreateAppointment} className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Select Patient</label>
                    <select
                      required
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={newAppointment.patientId}
                      onChange={e => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                    >
                      <option value="">Select registered patient...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.fullName} ({p.nupn})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">EAC Session Stage</label>
                    <select
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={newAppointment.stage}
                      onChange={e => setNewAppointment({ ...newAppointment, stage: e.target.value as any })}
                    >
                      <option value="Session 1">EAC Session 1 (Initial Barrier Identification)</option>
                      <option value="Session 2">EAC Session 2 (Follow-up & Adherence Plan)</option>
                      <option value="Session 3">EAC Session 3 (Pre-repeat VL Check)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-slate-600">Date</label>
                      <input
                        type="date"
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={newAppointment.scheduledDate}
                        onChange={e => setNewAppointment({ ...newAppointment, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600">Time</label>
                      <input
                        type="time"
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={newAppointment.scheduledTime}
                        onChange={e => setNewAppointment({ ...newAppointment, scheduledTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-lg transition">
                    Schedule Appointment & Set Reminders
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Registered Patient Roster</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Patients undergoing Enhanced Adherence Counseling.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search NUPN or name..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                    <th className="p-4">NUPN / ID</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Baseline VL</th>
                    <th className="p-4">Current EAC Stage</th>
                    <th className="p-4">Consent Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-medium text-slate-900">{patient.nupn}</td>
                      <td className="p-4 font-medium">{patient.fullName}</td>
                      <td className="p-4">{patient.phoneNumber}</td>
                      <td className="p-4 font-semibold text-slate-800">{patient.baselineViralLoad.toLocaleString()} copies/mL</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {patient.currentStage}
                        </span>
                      </td>
                      <td className="p-4">
                        {patient.consentFlag ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                            <CheckCircle className="h-4 w-4 shrink-0" /> SMS Consent Given
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                            <XCircle className="h-4 w-4 shrink-0" /> Opted Out
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">EAC Appointment Schedule</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Scheduled multi-session counseling check-ins.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Stage</th>
                    <th className="p-4">Scheduled Date & Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {appointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="p-4 font-medium">
                        {apt.patientName}
                        <div className="text-xs text-slate-400">{apt.phoneNumber}</div>
                      </td>
                      <td className="p-4 font-semibold text-blue-600">{apt.stage}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                          {apt.scheduledDate} at {apt.scheduledTime}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          apt.status === 'Attended' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleTriggerManualSMS(apt)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <MessageSquare className="h-3.5 w-3.5 shrink-0" /> Dispatch SMS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ATTENDANCE & FOLLOW-UPS */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Attendance & Follow-up Roster</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Log session attendance and action missed appointments.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Session</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Update Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {appointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="p-4 font-medium">{apt.patientName}</td>
                      <td className="p-4">{apt.stage}</td>
                      <td className="p-4">{apt.scheduledDate}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          apt.status === 'Attended' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Missed' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'Attended')}
                            className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 transition"
                          >
                            Mark Attended
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'Missed')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
                          >
                            Flag Missed
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SMS LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Neutral SMS Dispatch Logs</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Audit trail of automated notifications sent to patients (privacy preserved).</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Message Content (Neutral)</th>
                    <th className="p-4">Sent At</th>
                    <th className="p-4">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {smsLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono text-xs">{log.phoneNumber}</td>
                      <td className="p-4 text-slate-600 max-w-md text-xs sm:text-sm">{log.message}</td>
                      <td className="p-4 text-xs text-slate-500">{log.sentAt}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}