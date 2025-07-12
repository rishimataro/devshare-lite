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

        // if (session) {
        //     router.push('/dashboard/home');
        // } else {
        //     router.push('/auth/login');
        // }
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
            gap: '20px',
            backgroundImage: 'url("/backgroundApp.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1
            }}></div>
            <div style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                color: 'white'
            }}>
                <img
                    src="/logo.png"
                    alt="DevShare Logo"
                    style={{
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <h1 style={{ color: 'white', fontSize: '3rem', margin: '0 0 10px 0' }}>DEVSHARE LIFE</h1>
                <p
                    style={{
                        color: 'white',
                        fontSize: '1.2rem',
                        lineHeight: '1.5',
                        maxWidth: '700px',
                        textAlign: 'center',
                        marginBottom: '30px',
                        padding: '0 16px',
                        fontStyle: 'italic'
                    }}
                >
                    <strong>DevShare Life</strong> – nơi bạn có thể viết lên ý tưởng, chia sẻ kiến thức, kết nối với cộng đồng qua những bài viết, bình luận sôi nổi và tìm kiếm thông tin một cách nhanh chóng. <br />
                    Hãy bắt đầu hành trình chia sẻ của bạn ngay hôm nay!
                </p>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '16px',
                            marginTop: '24px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={() => router.push('/auth/login')}
                            style={{
                                backgroundColor: 'var(--color-secondary)',
                                color: '#fff',
                                fontSize: '16px',
                                padding: '10px 24px',
                                borderRadius: '4px',
                                fontWeight: 500,
                            }}
                        >
                            Đăng nhập
                        </Button>

                        <Button
                            type="primary"
                            onClick={() => router.push('/auth/register')}
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: '#fff',
                                fontSize: '16px',
                                padding: '10px 24px',
                                borderRadius: '4px',
                                fontWeight: 500,
                            }}
                        >
                            Đăng ký
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
