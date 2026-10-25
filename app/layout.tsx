import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EAC Patient Reminder & Adherence Management System',
  description: 'Clinical web application for managing Enhanced Adherence Counseling sessions and neutral SMS reminders.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}