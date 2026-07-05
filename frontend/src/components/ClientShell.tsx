'use client';

import { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ChatDrawer from '@/components/ChatDrawer';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AuthProvider>
      <Navbar onOpenChat={() => setChatOpen(true)} />
      <main>{children}</main>
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </AuthProvider>
  );
}
