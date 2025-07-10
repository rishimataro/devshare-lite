'use client';

import React from 'react';
import { Card, Typography, App } from 'antd';
import Image from 'next/image';
import RegisterForm from '@/components/auth/RegisterForm';

const { Title, Text } = Typography;

const HIDE_BANNER_WIDTH = 768;

const RegisterPage: React.FC = () => {
    return (
        <App>
            <RegisterContent />
        </App>
    );
};

const RegisterContent: React.FC = () => {
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const showBanner = windowWidth > HIDE_BANNER_WIDTH;

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexWrap: 'wrap',
                background: '#fff',
                flexDirection: showBanner ? 'row' : 'column',
            }}
        >
            {/* Start: Left side */}
            <div
                style={{
                    flex: showBanner ? 1 : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    width: showBanner ? '50%' : '100%',
                    maxWidth: '100vw',
                }}
                className="register-form-wrapper"
            >
                <Card
                    style={{
                        width: '100%',
                        maxWidth: '550px',
                        borderRadius: '12px',
                        border: 'none'
                    }}
                    styles={{ body: { padding: '40px 30px' } }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            style={{ marginBottom: '10px' }}
                        />
                        <Title level={2} style={{
                            margin: '0 0 8px 0',
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            fontSize: '28px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            ĐĂNG KÝ
                        </Title>
                        <Text   
                            type="secondary" 
                            style={{ 
                                fontSize: '14px',
                                fontStyle: 'italic',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.5',
                                maxHeight: '3em'
                            }}>
                            Tham gia ngay hôm nay để bắt đầu hành trình viết và khám phá của riêng bạn
                        </Text>
                    </div>

                    <RegisterForm />
                </Card>
            </div>
            {/* End: Left side */}

            {/* Start: Right side */}
            {showBanner && (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '40px',
                        width: '50%',
                        maxWidth: '100vw',
                    }}
                    className="register-banner"
                >
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        maxWidth: '600px',
                        maxHeight: '500px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                    }}>
                        <Image
                            src="/bannerRegister.jpg"
                            alt="Register Banner"
                            fill
                            style={{
                                objectFit: 'cover'
                            }}
                            priority
                        />
                    </div>

                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        left: '-50px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.15)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '50px',
                        right: '-20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '500px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '80px',
                        right: '50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '300px',
                        left: '50px',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }} />
                </div>
            )}
            {/* End: Right side */}

            {/* Styles */}
            <style jsx>{`
                @media (max-width: 900px) {
                    .register-banner {
                        display: none !important;
                    }
                    .register-form-wrapper {
                        width: 100% !important;
                        padding: 20px !important;
                    }
                }
                @media (max-width: 600px) {
                    .register-form-wrapper {
                        padding: 8px !important;
                    }
                    .ant-card {
                        max-width: 100vw !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;