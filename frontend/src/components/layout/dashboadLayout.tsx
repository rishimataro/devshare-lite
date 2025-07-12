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
    HeartOutlined,
    BookOutlined,
    UserOutlined,
    SettingOutlined,
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

    // Menu items for the sidebar
    const menuItems = [
        {
            key: '/dashboard/home',
            icon: <HomeOutlined />,
            label: 'Home',
        },
        {
            key: '/dashboard/createPosts',
            icon: <PlusOutlined />,
            label: 'Create Post',
        },
        {
            key: '/dashboard/myPosts',
            icon: <FileTextOutlined />,
            label: 'My Posts',
        },
    ];

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Profile',
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
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: () => signOut({ callbackUrl: '/auth/login' }),
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        router.push(key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
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
                }}
            >
                <div style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: borderRadiusLG,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                }}>
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
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
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
                        borderBottom: '1px solid #f0f0f0',
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
                                <span style={{ color: '#666' }}>
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
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;