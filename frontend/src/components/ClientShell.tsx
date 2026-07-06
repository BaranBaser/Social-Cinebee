'use client';

import { Suspense, useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import SocialPanel from '@/components/SocialPanel';
import ChatDrawer from '@/components/ChatDrawer';

function ShellInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-ink">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>

        <div className={`flex-1 flex flex-col ml-[240px] ${user ? 'mr-0 lg:mr-[300px]' : ''}`}>
          <Suspense fallback={null}>
            <TopBar onOpenChat={() => setChatOpen(true)} />
          </Suspense>
          <main className="flex-1">{children}</main>
        </div>

        {user && <SocialPanel />}
        <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </NotificationProvider>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ShellInner>{children}</ShellInner>
    </AuthProvider>
  );
}
