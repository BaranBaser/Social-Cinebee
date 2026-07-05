'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;
  if (!user) {
    router.push('/login');
    return null;
  }
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;
  if (!user) {
    router.push('/login');
    return null;
  }
  if (user.role !== 'admin') {
    router.push('/');
    return null;
  }
  return <>{children}</>;
}
