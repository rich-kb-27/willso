import { NextResponse } from 'next/server';
import { buildNeutralSMSMessage, sendSMSNotification } from '../../../lib/sms';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientName, phoneNumber, appointmentDate, appointmentTime } = body;

    if (!phoneNumber || !appointmentDate) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const neutralMessage = buildNeutralSMSMessage(patientName, appointmentDate, appointmentTime);
    const result = await sendSMSNotification(phoneNumber, neutralMessage);

    return NextResponse.json({
      status: 'success',
      data: result,
      sentMessage: neutralMessage
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send SMS' }, { status: 500 });
  }
}