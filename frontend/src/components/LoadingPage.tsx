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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <Spin tip={message} size="large">
        <div style={{ width: 100, height: 100 }} />
      </Spin>
    </div>
  );
};

export default LoadingPage;
