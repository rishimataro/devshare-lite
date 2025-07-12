'use client';

import React, { useState } from 'react';
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Typography,
    Space,
    Button,
    theme,
    MenuProps,
} from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    PlusOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: '/dashboard/home',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
        },
        {
            key: '/dashboard/createPosts',
            icon: <PlusOutlined />,
            label: 'Tạo bài viết',
        },
        {
            key: '/dashboard/myPosts',
            icon: <FileTextOutlined />,
            label: 'Bài viết của tôi',
        },
    ];

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Trang cá nhân',
            icon: <UserOutlined />,
            onClick: () => {
                if (session?.user?._id) {
                    router.push(`/dashboard/profile/${session.user._id}`);
                }
            },
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: () => signOut({ callbackUrl: '' }),
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        router.push(key);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'bodyBg' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: 'var(--color-bg-sidebar)',
                }}
            >
                <div style={{
                    height: 64,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: borderRadiusLG,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    gap: '8px',
                }}>
                    {!collapsed && (
                        <img 
                            src="/logo.png" 
                            alt="DevShare Logo" 
                            style={{
                                width: 24,
                                height: 24,
                                objectFit: 'contain'
                            }}
                        />
                    )}
                    {collapsed ? 'DS' : 'DevShare'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s', background: 'var(--color-primary)' }}>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid var(--color-accent)',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    
                    <Space style={{ marginRight: 24 }}>
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                        >
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar 
                                    size="default" 
                                    icon={<UserOutlined />}
                                />
                                <span style={{ color: 'var(--color-text)' }}>
                                    {session?.user?.username || 'User'}
                                </span>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: 'var(--color-bg-content)',
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;