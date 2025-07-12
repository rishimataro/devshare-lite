import React from 'react';
import { ConfigProvider, App } from 'antd';

interface AntdConfigProps {
    children: React.ReactNode;
}

const AntdConfig: React.FC<AntdConfigProps> = ({ children }) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#F875AA', // var(--color-primary)
                    colorBgBase: '#fefefe', // var(--color-bg-dashboard) - màu kem nhạt
                    colorTextBase: '#171717', // var(--color-text)
                    colorLink: '#0089ED', // var(--color-secondary)
                    colorLinkHover: '#AEDEFC', // var(--color-accent)
                    colorBgContainer: '#ffffff', // var(--color-bg-content) - trắng cho content
                    colorBorder: '#AEDEFC', // var(--color-accent)
                    colorBgLayout: '#fefefe', // Background cho layout
                },
                components: {
                    Button: {
                        colorPrimary: '#F875AA',
                        colorPrimaryHover: '#AEDEFC',
                        colorPrimaryActive: '#F875AA',
                    },
                    Input: {
                        colorBorder: '#AEDEFC',
                        colorPrimary: '#0089ED',
                    },
                    Card: {
                        colorBorderSecondary: '#AEDEFC',
                        colorBgContainer: '#ffffff', // Card background trắng
                    },
                    Layout: {
                        colorBgBody: '#fefefe', // Layout background kem nhạt
                        colorBgHeader: '#ffffff', // Header background trắng
                    }
                }
            }}
        >
            <App>
                {children}
            </App>
        </ConfigProvider>
    );
};

export default AntdConfig;
