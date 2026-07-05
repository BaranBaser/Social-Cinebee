'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import SocialPanel from '@/components/SocialPanel';
import ChatDrawer from '@/components/ChatDrawer';

function ShellInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />

      <div className={`flex-1 flex flex-col ml-[240px] ${user ? 'mr-0 lg:mr-[300px]' : ''}`}>
        <TopBar onOpenChat={() => setChatOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>

      {user && <SocialPanel />}
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ShellInner>{children}</ShellInner>
    </AuthProvider>
  );
}
