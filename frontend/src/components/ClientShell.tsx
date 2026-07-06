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
  const [socialCollapsed, setSocialCollapsed] = useState(false);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-ink">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>

        <div className={`flex-1 flex flex-col md:ml-[240px] pb-[60px] md:pb-0 transition-all duration-300 ${user ? (socialCollapsed ? 'md:mr-[52px]' : 'mr-0 lg:mr-[300px]') : ''}`}>
          <Suspense fallback={null}>
            <TopBar onOpenChat={() => setChatOpen(true)} socialCollapsed={socialCollapsed} setSocialCollapsed={setSocialCollapsed} />
          </Suspense>
          <main className="flex-1">{children}</main>
        </div>

        {user && <SocialPanel collapsed={socialCollapsed} onToggle={() => setSocialCollapsed(!socialCollapsed)} />}
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
