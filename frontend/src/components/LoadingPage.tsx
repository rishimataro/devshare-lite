'use client';

import React from 'react';
import { Spin } from 'antd';

interface LoadingPageProps {
    message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message = "Loading..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: '16px'
        }}>
            <Spin size="large" />
            <div style={{ fontSize: '16px', color: '#666' }}>{message}</div>
        </div>
    );
};

export default LoadingPage;
