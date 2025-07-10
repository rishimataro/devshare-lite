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
                message.error('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
            } else {
                message.success('Đăng nhập thành công!');
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/dashboard/home');
                }
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Lỗi: ', errorInfo);
        message.error('Vui lòng kiểm tra lại các trường thông tin.');
    };

    return (
        <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    Chào mừng bạn trở lại
                </Title>
                <Text type="secondary" style={{ fontSize: 16, fontStyle: 'italic' }}>
                    Nền tảng chia sẻ bài viết cho phép bạn tạo, quản lý, công khai nội dung, tương tác qua bình luận và tìm kiếm thông tin dễ dàng
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
                        { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                        { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                    ]}
                >
                    <AuthInput
                        placeholder="Nhập tên đăng nhập của bạn"
                        prefixIcon={<UserOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu của bạn"
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
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Space direction="vertical" size={8}>
                        <Text type="secondary">
                            Chưa có tài khoản?{' '}
                            <Link href="/auth/register" style={{ color: '#1890ff' }}>
                                Đăng ký ngay
                            </Link>
                        </Text>
                        <Link href="/auth/forgot-password" style={{ color: '#1890ff' }}>
                            Quên mật khẩu?
                        </Link>
                    </Space>
                </div>
            </Form>
        </div>
    );
};

export default LoginForm;
