'use client';

import React from 'react';
import { App } from 'antd';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';

const HIDE_BANNER_WIDTH = 768; 

const LoginPage: React.FC = () => {
    return (
        <App>
            <LoginContent />
        </App>
    );
};

const LoginContent: React.FC = () => {
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
            {showBanner && (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        background: '#F875AA',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '40px',
                        width: '50%',
                        maxWidth: '100vw',
                    }}
                    className="login-banner"
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
                            src="/bannerLogin.jpg"
                            alt="Login Banner"
                            fill
                            style={{
                                objectFit: 'cover'
                            }}
                            priority
                        />
                    </div>

                    {/* Circles */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.15)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '50px',
                        left: '-20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '500px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '480px',
                        left: '50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '300px',
                        left: '650px',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }} />
                </div>
            )}
            {/* End: Left side */}

            {/* Start: Right side*/}
            <div
                style={{
                    flex: showBanner ? 1 : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px',
                    width: showBanner ? '50%' : '100%',
                    maxWidth: '100vw',
                }}
                className="login-form-wrapper"
            >
                <div style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '40px 30px',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={105}
                            height={105}
                            style={{ marginBottom: '10px' }}
                        />
                    </div>

                    <LoginForm />
                </div>
            </div>
            {/* End: Right side */}

            {/* Styles */}
            <style jsx>{`
                @media (max-width: 900px) {
                    .login-banner {
                        display: none !important;
                    }
                    .login-form-wrapper {
                        width: 100% !important;
                        padding: 20px !important;
                    }
                }
                @media (max-width: 600px) {
                    .login-form-wrapper {
                        padding: 8px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;