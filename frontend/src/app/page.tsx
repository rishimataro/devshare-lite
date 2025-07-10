'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "antd";
import LoadingPage from '@/components/LoadingPage';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (session) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard/home');
    } else {
      // User is not authenticated, redirect to login
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Show loading while redirecting
  if (status === 'loading') {
    return <LoadingPage message="Checking authentication..." />;
  }

  // This will rarely be shown as user gets redirected
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>DevShare Lite</h1>
      <p>Redirecting...</p>
      <div>
        <Button type="primary" onClick={() => router.push('/auth/login')}>
          Go to Login
        </Button>
      </div>
    </div>
  );
}
