'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ProfileContent from '@/components/ProfileContent';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  return (
    <ProtectedRoute>
      <ProfileContent profileUserId={userId} />
    </ProtectedRoute>
  );
}
