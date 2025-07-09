'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../transitions.css';

const { Title, Text } = Typography;

interface LoginFormData {
    username: string;
    password: string;
}

const HIDE_BANNER_WIDTH = 768; 

const LoginPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const router = useRouter();

    React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


    const onFinish = async (values: LoginFormData) => {
        setLoading(true);
        try {
            message.success('Đăng nhập thành công!');
            router.push('/dashboard');
        } catch (error) {
            message.error('Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

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
                <Card
                    style={{
                        width: '100%',
                        maxWidth: '550px',
                        // boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        border: 'none'
                    }}
                    styles={{ body: { padding: '40px 30px' } }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={105}
                            height={105}
                            style={{ marginBottom: '10px' }}
                        />
                        <Title level={2} style={{
                            margin: '0 0 8px 0',
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            fontSize: '32px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            ĐĂNG NHẬP
                        </Title>
                        <Text   
                                type="secondary" 
                                style={{ 
                                    fontSize: '16px',
                                    fontStyle: 'italic',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: '1.5',
                                    maxHeight: '4.5em'
                                 }}>
                            Nền tảng chia sẻ bài viết cho phép bạn tạo, quản lý, công khai nội dung, tương tác qua bình luận và tìm kiếm thông tin dễ dàng
                        </Text>
                    </div>

                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            label={<Text strong 
                                style={{ 
                                    fontSize: '15px',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    Nhập tên tài khoản</Text>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên tài khoản' }
                            ]}
                            style={{ marginBottom: '24px' }}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Tên tài khoản"
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 15px',
                                    height: '46px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<Text strong 
                                style={{ 
                                    fontSize: '15px',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                 }}>
                                    Nhập mật khẩu</Text>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                            style={{ marginBottom: '24px' }}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 15px',
                                    height: '46px'
                                }}
                            />
                        </Form.Item>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <Text style={{ fontSize: '15px' }}>
                                Chưa có tài khoản? <Link href="/auth/register" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Đăng ký</Link>
                            </Text>
                            <Link 
                                    href="/auth/forgot-password" 
                                    style={{ 
                                        color: 'var(--color-primary)', 
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '100%'
                                    }}>
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Form.Item style={{ marginBottom: '16px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{
                                    width: '100%',
                                    height: '46px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    background: 'var(--color-primary)',
                                    border: 'none',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
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
                    .ant-card {
                        max-width: 100vw !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;