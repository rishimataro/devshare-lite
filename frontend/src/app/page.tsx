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
        if (status === 'loading') return;

        if (session) {
            router.push('/dashboard/home');
        } else {
            router.push('/auth/login');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <LoadingPage message="Kiểm tra xác thực..." />;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <h1>DEVSHARE LIFE</h1>
            <p>Chào mừng bạn đến với DevShare Life!</p>
            <div>
                <Button type="primary" style={{ marginRight: '10px', backgroundColor: '--color-secondary' }} onClick={() => router.push('/auth/login')}>
                    Đăng nhập
                </Button>
                <Button type="primary" style={{ backgroundColor: '--color-primary' }} onClick={() => router.push('/auth/register')}>
                    Đăng ký
                </Button>
            </div>
        </div>
    );
}
