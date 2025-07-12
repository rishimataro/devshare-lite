'use client';

import React from 'react';
import { Spin } from 'antd';

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        gap: '20px',
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <Spin size="large" tip={message} />
    </div>
  );
};

export default LoadingPage;
