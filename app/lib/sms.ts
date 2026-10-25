// Helper to compose privacy-preserving SMS messages without disclosing medical conditions
export function buildNeutralSMSMessage(patientName: string, appointmentDate: string, time: string): string {
  const firstName = patientName.split(' ')[0];
  return `Hello ${firstName}, this is a friendly reminder of your upcoming check-in appointment scheduled for ${appointmentDate} at ${time}. If you need to reschedule, please contact your clinic officer.`;
}

export async function sendSMSNotification(phoneNumber: string, message: string) {
  // Integrate with your provider here (Twilio, Africa's Talking, or local gateway)
  // Example mock payload:
  console.log(`[SMS GATEWAY] Dispatching SMS to ${phoneNumber}: "${message}"`);
  
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
}