'use client';

import React from 'react';
import { Form, Input, Button, Typography, App, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/utils/api';

const { Text } = Typography;

interface RegisterFormData {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface RegisterFormProps {
    onSuccess?: () => void;
    loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, loading: externalLoading }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const isLoading = loading || externalLoading;

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
            
            // Check registration success
            if (result?._id && !result?.error && !result?.statusCode) {
                message.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push(`/auth/verify/${result._id}`);
                }
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

    return (
        <div style={{ width: '100%' }}>
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
                        loading={isLoading}
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
        </div>
    );
};

export default RegisterForm;