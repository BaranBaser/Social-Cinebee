'use client';

import { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ChatDrawer from '@/components/ChatDrawer';
import Particles from '@/components/Particles';
import Image from 'next/image';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AuthProvider>
      {/* Background Particles */}
      <Particles />

      {/* Left Banner */}
      <div className="fixed inset-y-0 left-0 w-[18vw] 2xl:w-[22vw] hidden xl:block pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#000000]/60 to-[#000000] z-10" />
        <div className="absolute inset-y-0 left-0 w-full h-full opacity-30 mix-blend-lighten">
          <Image src="/banner_left.png" alt="Left Banner" fill className="object-cover object-left" priority />
        </div>
      </div>
      
      {/* Right Banner */}
      <div className="fixed inset-y-0 right-0 w-[18vw] 2xl:w-[22vw] hidden xl:block pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#000000]/60 to-[#000000] z-10" />
        <div className="absolute inset-y-0 right-0 w-full h-full opacity-30 mix-blend-lighten">
          <Image src="/banner_right.png" alt="Right Banner" fill className="object-cover object-right" priority />
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onOpenChat={() => setChatOpen(true)} />
        <main className="flex-grow">{children}</main>
        <footer className="py-6 text-center text-xs text-gray-500 border-t border-white/[0.06] mt-auto">
          &copy; {new Date().getFullYear()} Cinebee. Tüm hakları saklıdır.
        </footer>
      </div>
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </AuthProvider>
  );
}
