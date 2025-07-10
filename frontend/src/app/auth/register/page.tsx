'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Divider, Space, message, Checkbox, App } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/utils/api';

const { Title, Text } = Typography;

interface RegisterFormData {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

const HIDE_BANNER_WIDTH = 768;

const RegisterPage: React.FC = () => {
    return (
        <App>
            <RegisterContent />
        </App>
    );
};

const RegisterContent: React.FC = () => {
    const { message}  = App.useApp();
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

    const onFinish = async (values: RegisterFormData) => {
        setLoading(true);
        try {
            const { fullName, username, email, password, confirmPassword } = values;

            const result = await sendRequest<any>({
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
                method: 'POST',
                body: {
                    fullName,
                    username,
                    email,
                    password,
                    confirmPassword
                }
            });
            
            console.log('Registration result:', result);
            
            // Check registration
            if (result?._id && !result?.error && !result?.statusCode) {
                message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
                router.push(`/auth/verify/${result._id}`);
            } else {
                const errorMessage = result?.message || result?.error || 'Đăng ký thất bại. Vui lòng thử lại sau.';
                message.error(errorMessage);
            }
            
        } catch (error: any) {
            console.error('Registration error:', error);
            message.error('Đăng ký thất bại. Vui lòng thử lại.');
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
            <div
                style={{
                    flex: showBanner ? 1 : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    width: showBanner ? '50%' : '100%',
                    maxWidth: '100vw',
                }}
                className="register-form-wrapper"
            >
                <Card
                    style={{
                        width: '100%',
                        maxWidth: '550px',
                        borderRadius: '12px',
                        border: 'none'
                    }}
                    styles={{ body: { padding: '40px 30px' } }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            style={{ marginBottom: '10px' }}
                        />
                        <Title level={2} style={{
                            margin: '0 0 8px 0',
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            fontSize: '28px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            ĐĂNG KÝ
                        </Title>
                        <Text   
                            type="secondary" 
                            style={{ 
                                fontSize: '14px',
                                fontStyle: 'italic',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: '1.5',
                                maxHeight: '3em'
                            }}>
                            Tham gia ngay hôm nay để bắt đầu hành trình viết và khám phá của riêng bạn
                        </Text>
                    </div>

                    <Form
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="fullName"
                            label={<Text strong style={{ fontSize: '14px' }}>Họ và tên</Text>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ tên!' },
                                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                            ]}
                            style={{ marginBottom: '10px' }}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Họ và tên"
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 15px',
                                    height: '44px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            label={<Text strong style={{ fontSize: '14px' }}>Tên tài khoản</Text>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên tài khoản!' },
                                { min: 6, message: 'Tên tài khoản phải có ít nhất 6 ký tự!' }
                            ]}
                            style={{ marginBottom: '10px' }}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Tên tài khoản"
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 15px',
                                    height: '44px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label={<Text strong style={{ fontSize: '14px' }}>Email</Text>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                            style={{ marginBottom: '10px' }}
                        >
                            <Input
                                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Email"
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 15px',
                                    height: '44px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<Text strong style={{ fontSize: '14px' }}>Mật khẩu</Text>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                            style={{ marginBottom: '10px' }}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 15px',
                                    height: '44px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label={<Text strong style={{ fontSize: '14px' }}>Xác nhận mật khẩu</Text>}
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                            style={{ marginBottom: '10px' }}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Xác nhận mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px 15px',
                                    height: '44px'
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="agreeToTerms"
                            valuePropName="checked"
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Vui lòng đồng ý với điều khoản sử dụng!' 
                                }
                            ]}
                            style={{ marginBottom: '20px' }}
                        >
                            <Checkbox style={{ fontSize: '13px' }}>
                                Tôi đồng ý với{' '}
                                <Link href="/terms" style={{ color: 'var(--color-primary)' }}>
                                    điều khoản sử dụng
                                </Link>
                                {' '}và{' '}
                                <Link href="/privacy" style={{ color: 'var(--color-primary)' }}>
                                    chính sách bảo mật
                                </Link>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '16px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{
                                    width: '100%',
                                    height: '44px',
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
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Text style={{ fontSize: '14px' }}>
                                Đã có tài khoản?{' '}
                                <Link 
                                    href="/auth/login" 
                                    style={{ 
                                        color: 'var(--color-primary)',
                                        fontWeight: 500,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Đăng nhập ngay
                                </Link>
                            </Text>
                        </div>
                    </Form>
                </Card>
            </div>
            {/* End: Left side */}

            {/* Start: Right side */}
            {showBanner && (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '40px',
                        width: '50%',
                        maxWidth: '100vw',
                    }}
                    className="register-banner"
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
                            src="/bannerRegister.jpg"
                            alt="Register Banner"
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
                        left: '-50px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.15)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '50px',
                        right: '-20px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '500px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '80px',
                        right: '50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '300px',
                        left: '50px',
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }} />
                </div>
            )}
            {/* End: Right side */}

            {/* Styles */}
            <style jsx>{`
                @media (max-width: 900px) {
                    .register-banner {
                        display: none !important;
                    }
                    .register-form-wrapper {
                        width: 100% !important;
                        padding: 20px !important;
                    }
                }
                @media (max-width: 600px) {
                    .register-form-wrapper {
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

export default RegisterPage;