'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, App, Alert, Space } from 'antd';
import { MailOutlined, SafetyOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/utils/api';

const { Title, Text } = Typography;

interface VerifyFormData {
    verificationCode: string;
}

interface VerifyPageProps {
    params: Promise<{ id: string }>;
}

const HIDE_BANNER_WIDTH = 768;

const VerifyPage: React.FC<VerifyPageProps> = ({ params }) => {
    return (
        <App>
            <VerifyContent params={params} />
        </App>
    );
};

const VerifyContent: React.FC<VerifyPageProps> = ({ params }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [resending, setResending] = React.useState(false);
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const [userId, setUserId] = React.useState<string>('');
    const router = useRouter();

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        // Extract user ID from params
        params.then(p => {
            setUserId(p.id);
        });
    }, [params]);

    const onFinish = async (values: VerifyFormData) => {
        if (!userId) {
            message.error('Không tìm thấy thông tin người dùng. Vui lòng thử lại.');
            return;
        }

        setLoading(true);
        try {
            const { verificationCode } = values;

            const result = await sendRequest<any>({
                url: `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-account`,
                method: 'POST',
                body: {
                    userId,
                    verificationCode
                }
            });

            console.log('Verification result:', result);

            // Check if verification successful
            if (result?.message && !result?.error && !result?.statusCode) {
                message.success('Xác thực tài khoản thành công! Tài khoản của bạn đã được kích hoạt.');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                const errorMessage = result?.message || result?.error || 'Xác thực thất bại. Vui lòng thử lại.';
                message.error(errorMessage);
            }

        } catch (error: any) {
            console.error('Verification error:', error);
            message.error('Xác thực thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!userId) {
            message.warning('Không tìm thấy thông tin người dùng. Vui lòng thử lại.');
            return;
        }

        setResending(true);
        try {
            const result = await sendRequest<any>({
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/resend-verification`,
                method: 'POST',
                body: {
                    userId
                }
            });

            if (result?.message && !result?.error && !result?.statusCode) {
                message.success('Mã xác thực mới đã được gửi đến email đã đăng ký của bạn.');
            } else {
                const errorMessage = result?.message || result?.error || 'Gửi lại mã thất bại. Vui lòng thử lại.';
                message.error(errorMessage);
            }

        } catch (error: any) {
            console.error('Resend verification error:', error);
            message.error('Gửi lại mã thất bại. Vui lòng thử lại.');
        } finally {
            setResending(false);
        }
    };

    const showBanner = windowWidth > HIDE_BANNER_WIDTH;

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexWrap: 'wrap',
                background: `url('/bgVerify.jpg') center center / cover no-repeat`,
                flexDirection: showBanner ? 'row' : 'column',
                position: 'relative',
            }}
        >
            <div
                style={{
                    flex: showBanner ? 1 : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    width: showBanner ? '50%' : '100%',
                    maxWidth: '100vw',
                }}
                className="verify-form-wrapper"
            >
                <Card
                    style={{
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(255,255,255,0.7)',
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <Image
                            src="/logo.png"
                            alt="DevShare Logo"
                            width={100}
                            height={100}
                            style={{ 
                                marginBottom: '16px',
                                borderRadius: '8px',
                                border: 'none',
                             }}
                        />
                        <Title 
                                level={2} 
                                style={{ 
                                    margin: 0, 
                                    color: 'var(--color-primary)', 
                                    fontWeight: 700, 
                                }}>
                            XÁC THỰC TÀI KHOẢN
                        </Title>
                        <Text type="secondary" style={{ fontSize: '15px', fontStyle: 'italic' }}>
                            Vui lòng nhập mã xác thực đã được gửi đến email đã đăng ký
                        </Text>
                    </div>

                    <Alert
                        message="Kiểm tra email"
                        description="Chúng tôi đã gửi mã xác thực gồm 32 ký tự đến email đã đăng ký của bạn. Mã có hiệu lực trong 5 phút."
                        type="info"
                        showIcon
                        icon={<MailOutlined style={{ color: 'var(--color-primary)' }} />}
                        style={{ 
                            marginBottom: '24px',
                            backgroundColor: 'rgba(255, 223, 223, 0.3)',
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)'
                        }}
                    />

                    <Form
                        form={form}
                        name="verify"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            label="Mã xác thực"
                            name="verificationCode"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã xác thực!' },
                            ]}
                        >
                            <Input
                                prefix={<SafetyOutlined />}
                                placeholder="Nhập mã xác thực"
                                style={{ borderRadius: '8px', letterSpacing: '2px' }}
                                maxLength={50}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '16px' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                icon={<CheckCircleOutlined />}
                                style={{
                                    height: '48px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    background: 'var(--color-primary)'
                                }}
                            >
                                {loading ? 'Đang xác thực...' : 'Xác thực tài khoản'}
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <Text type="secondary">Không nhận được mã? </Text>
                            <Button
                                type="link"
                                onClick={handleResendCode}
                                loading={resending}
                                style={{ padding: 0, color: 'var(--color-primary)' }}
                            >
                                {resending ? 'Đang gửi...' : 'Gửi lại'}
                            </Button>
                        </div>
                    </Form>

                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Space>
                            <ArrowLeftOutlined />
                            <Link href="/auth/login" style={{ color: 'var(--color-primary)' }}>
                                Quay lại đăng nhập
                            </Link>
                        </Space>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default VerifyPage;