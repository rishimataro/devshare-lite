import React from 'react';
import { ConfigProvider, App } from 'antd';

interface AntdConfigProps {
    children: React.ReactNode;
}

const AntdConfig: React.FC<AntdConfigProps> = ({ children }) => {
    return (
        <ConfigProvider
            theme={{
                token: {},
            }}
        >
            <App>
                {children}
            </App>
        </ConfigProvider>
    );
};

export default AntdConfig;
