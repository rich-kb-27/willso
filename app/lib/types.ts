export type EACStage = 'Session 1' | 'Session 2' | 'Session 3' | 'Completed';
export type AttendanceStatus = 'Scheduled' | 'Attended' | 'Missed' | 'Rescheduled';

export interface Patient {
  id: string;
  nupn: string; // National Unique Patient Number / Hospital ID
  fullName: string;
  phoneNumber: string;
  baselineViralLoad: number;
  currentStage: EACStage;
  consentFlag: boolean;
  createdAt: string;
}

export interface EACAppointment {
  id: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  stage: EACStage;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: AttendanceStatus;
  reminderSent24h: boolean;
  reminderSent48h: boolean;
}

export interface SMSLog {
  id: string;
  patientId: string;
  phoneNumber: string;
  message: string;
  sentAt: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING';
}