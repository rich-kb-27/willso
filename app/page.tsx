'use client';

import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import PatientDashboard from './components/PatientDashboard';
import { Patient, EACAppointment, SMSLog } from './lib/types';

interface UserSession {
  name: string;
  role: 'admin' | 'patient';
  id?: string;
  nupn?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'dashboard'>('splash');
  const [user, setUser] = useState<UserSession | null>(null);

  // Initial State for Clinical Management Data matching lib/types
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'PTH-9021',
      nupn: 'PTH-9021',
      fullName: 'Chileshe Mwape',
      phoneNumber: '+260977000111',
      baselineViralLoad: 5000,
      currentStage: 'Session 1',
      consentFlag: true,
      createdAt: '2026-10-01'
    }
  ]);

  const [appointments, setAppointments] = useState<EACAppointment[]>([
    {
      id: 'APT-101',
      patientId: 'PTH-9021',
      patientName: 'Chileshe Mwape',
      phoneNumber: '+260977000111',
      stage: 'Session 1',
      scheduledDate: '2026-11-05',
      scheduledTime: '09:00',
      status: 'Scheduled',
      reminderSent24h: false,
      reminderSent48h: false
    }
  ]);

  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([
    {
      id: 'SMS-001',
      patientId: 'PTH-9021',
      phoneNumber: '+260977000111',
      message: 'Reminder: Your EAC clinical check-in is scheduled for Nov 5 at 09:00.',
      sentAt: '2026-10-26 14:00',
      status: 'DELIVERED'
    }
  ]);

  // Admin Handlers
  const handleRegisterPatient = (newPatientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const createdPatient: Patient = {
      ...newPatientData,
      id: `PTH-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPatients((prev) => [...prev, createdPatient]);
  };

  const handleCreateAppointment = (newAptData: Omit<EACAppointment, 'id' | 'status' | 'reminderSent24h' | 'reminderSent48h'>) => {
    const newApt: EACAppointment = {
      ...newAptData,
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Scheduled',
      reminderSent24h: false,
      reminderSent48h: false
    };
    setAppointments((prev) => [...prev, newApt]);
  };

  const handleUpdateAttendance = (appointmentId: string, status: 'Attended' | 'Missed' | 'Rescheduled') => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    );
  };

  const handleDispatchSMS = (log: SMSLog) => {
    setSmsLogs((prev) => [log, ...prev]);
  };

  // Patient Handler (Single Argument matching component expectation)
  const handleRequestReschedule = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'Rescheduled' } : apt
      )
    );
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('login')} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={(loggedInUser) => {
          setUser({
            name: loggedInUser.name,
            role: loggedInUser.role,
            id: loggedInUser.id || 'PTH-9021',
            nupn: loggedInUser.id || 'PTH-9021'
          });
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  // Active patient object for patient view
  const currentPatient = patients.find((p) => p.id === user?.id || p.nupn === user?.id) || patients[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {user?.role === 'admin' ? (
        <AdminDashboard
          patients={patients}
          appointments={appointments}
          smsLogs={smsLogs}
          onRegisterPatient={handleRegisterPatient}
          onCreateAppointment={handleCreateAppointment}
          onUpdateAttendance={handleUpdateAttendance}
          onDispatchSMS={handleDispatchSMS}
          onLogout={() => {
            setUser(null);
            setCurrentScreen('login');
          }}
        />
      ) : (
        <PatientDashboard
          patient={currentPatient}
          appointments={appointments}
          smsLogs={smsLogs}
          onRequestReschedule={handleRequestReschedule}
          onLogout={() => {
            setUser(null);
            setCurrentScreen('login');
          }}
        />
      )}
    </main>
  );
}