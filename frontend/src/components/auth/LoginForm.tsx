'use client';

import React from 'react';
import { Form, Input, Button, Typography, App, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import AuthInput from '@/components/input/authInput';

const { Title, Text } = Typography;

interface LoginFormData {
    username: string;
    password: string;
}

interface LoginFormProps {
    onSuccess?: () => void;
    loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, loading: externalLoading }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const isLoading = loading || externalLoading;

    const onFinish = async (values: LoginFormData) => {
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                message.error('Invalid credentials. Please try again.');
            } else {
                message.success('Login successful!');
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/dashboard/home');
                }
            }
        } catch (error) {
            message.error('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('Please fill in all required fields correctly.');
    };

    return (
        <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    Welcome Back
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                    Sign in to your account
                </Text>
            </div>

            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 3, message: 'Username must be at least 3 characters long!' }
                    ]}
                >
                    <AuthInput
                        placeholder="Enter your username"
                        prefixIcon={<UserOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters long!' }
                    ]}
                >
                    <Input.Password
                        placeholder="Enter your password"
                        prefix={<LockOutlined />}
                        iconRender={(visible: boolean) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 16 }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isLoading}
                        block
                        style={{ height: 48, fontSize: 16 }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Space direction="vertical" size={8}>
                        <Text type="secondary">
                            Don't have an account?{' '}
                            <Link href="/auth/register" style={{ color: '#1890ff' }}>
                                Sign up here
                            </Link>
                        </Text>
                        <Link href="/auth/forgot-password" style={{ color: '#1890ff' }}>
                            Forgot your password?
                        </Link>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default LoginForm;
