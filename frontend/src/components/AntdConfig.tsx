import React from 'react';
import { ConfigProvider } from 'antd';

interface AntdConfigProps {
  children: React.ReactNode;
}

const AntdConfig: React.FC<AntdConfigProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Add your theme tokens here if needed
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfig;
