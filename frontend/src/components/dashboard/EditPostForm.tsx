'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Select,
    Upload,
    Typography,
    Space,
    App,
    Row,
    Col,
    Tag,
    Spin,
} from 'antd';
import {
    SaveOutlined,
    EyeOutlined,
    EditOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { getPostByIdForOwner, updatePost } from '@/utils/postApi';
import ImageUpload from '@/components/input/ImageUpload';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PostFormData {
    title: string;
    content: string;
    tags: string[];
    images: string[];
    status: 'draft' | 'published' | 'archived';
}

interface Post {
    _id: string;
    title: string;
    content: string;
    status: 'published' | 'draft' | 'archived';
    tags: string[];
    images: string[];
    authorId: {
        _id: string;
        username: string;
    };
    createdAt: string;
    updatedAt: string;
}

const EditPostForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [post, setPost] = useState<Post | null>(null);
    const [preview, setPreview] = useState(false);
    const router = useRouter();
    const params = useParams();
    const { message } = App.useApp();

    const postId = params.id as string;

    const predefinedTags = [
        'JavaScript',
        'TypeScript',
        'React',
        'Next.js',
        'Node.js',
        'NestJS',
        'Python',
        'Java',
        'CSS',
        'HTML',
        'Database',
        'API',
        'Frontend',
        'Backend',
        'Full Stack',
        'DevOps',
        'Tutorial',
        'Best Practices',
        'Tips',
        'Review',
    ];

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            
            setInitialLoading(true);
            try {
                const data = await getPostByIdForOwner(postId);
                const postData = data as Post;
                setPost(postData);
                
                form.setFieldsValue({
                    title: postData.title,
                    content: postData.content,
                    tags: postData.tags || [],
                    images: postData.images || [],
                    status: postData.status,
                });
            } catch (error) {
                console.error('Không thể tải bài viết:', error);
                message.error('Không thể tải bài viết để chỉnh sửa');
                router.push('/dashboard/myPosts');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchPost();
    }, [postId, form, message, router]);

    const onFinish = async (values: PostFormData) => {
        setLoading(true);
        try {
            const postData = {
                title: values.title,
                content: values.content,
                tags: values.tags || [],
                images: values.images || [],
                status: values.status,
            };
            
            await updatePost(postId, postData);
            message.success('Bài viết đã được cập nhật thành công!');
            router.push('/dashboard/myPosts');
        } catch (error: any) {
            console.error('Không thể cập nhật bài viết:', error);

            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router.push('/auth/login');
            } else if (error.response?.status === 403) {
                message.error('Bạn không có quyền chỉnh sửa bài viết này.');
                router.push('/dashboard/myPosts');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể cập nhật bài viết. Vui lòng thử lại.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Lỗi:', errorInfo);
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
    };

    const handleSaveDraft = async () => {
        try {
            const values = await form.getFieldsValue();
            
            if (!values.title || !values.content) {
                message.error('Vui lòng điền ít nhất tiêu đề và nội dung để lưu bản nháp.');
                return;
            }
            
            setLoading(true);
            const postData = {
                title: values.title,
                content: values.content,
                tags: values.tags || [],
                images: values.images || [],
                status: 'draft' as const,
            };
            
            await updatePost(postId, postData);
            message.success('Bản nháp đã được lưu thành công!');
            router.push('/dashboard/myPosts');
        } catch (error: any) {
            console.error('Error saving draft:', error);
            
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router.push('/auth/login');
            } else if (error.response?.status === 403) {
                message.error('Bạn không có quyền chỉnh sửa bài viết này.');
                router.push('/dashboard/myPosts');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu bản nháp.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            const values = await form.validateFields();
            
            setLoading(true);
            const postData = {
                title: values.title,
                content: values.content,
                tags: values.tags || [],
                images: values.images || [],
                status: 'published' as const,
            };
            
            await updatePost(postId, postData);
            message.success('Bài viết đã được xuất bản thành công!');
            router.push('/dashboard/myPosts');
        } catch (error: any) {
            console.error('Error publishing post:', error);
            
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router.push('/auth/login');
            } else if (error.response?.status === 403) {
                message.error('Bạn không có quyền chỉnh sửa bài viết này.');
                router.push('/dashboard/myPosts');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể xuất bản bài viết.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        try {
            const values = await form.getFieldsValue();
            
            setLoading(true);
            const postData = {
                title: values.title,
                content: values.content,
                tags: values.tags || [],
                images: values.images || [],
                status: 'archived' as const,
            };
            
            await updatePost(postId, postData);
            message.success('Bài viết đã được lưu trữ thành công!');
            router.push('/dashboard/myPosts');
        } catch (error: any) {
            console.error('Error archiving post:', error);
            
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router.push('/auth/login');
            } else if (error.response?.status === 403) {
                message.error('Bạn không có quyền chỉnh sửa bài viết này.');
                router.push('/dashboard/myPosts');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu trữ bài viết.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Đang tải bài viết...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Title level={4}>Không tìm thấy bài viết</Title>
                    <Button onClick={() => router.push('/dashboard/myPosts')}>
                        <ArrowLeftOutlined /> Quay lại danh sách bài viết
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div>
            <Card
                title={
                    <Space>
                        <EditOutlined />
                        <Title level={3} style={{ margin: 0 }}>
                            Chỉnh sửa bài viết
                        </Title>
                        {post.status !== 'published' && (
                            <Tag color={post.status === 'draft' ? 'orange' : 'red'}>
                                {post.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                            </Tag>
                        )}
                    </Space>
                }
                extra={
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.push('/dashboard/myPosts')}
                        >
                            Quay lại
                        </Button>
                        <Button
                            icon={<SaveOutlined />}
                            onClick={handleSaveDraft}
                            loading={loading}
                        >
                            Lưu bản nháp
                        </Button>
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() => setPreview(!preview)}
                        >
                            {preview ? 'Chỉnh sửa' : 'Xem trước'}
                        </Button>
                    </Space>
                }
            >
                {!preview ? (
                    <Form
                        form={form}
                        name="editPost"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                    >
                        <Row gutter={[16, 0]}>
                            <Col xs={24} lg={16}>
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề bài viết"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tiêu đề bài viết!' },
                                        { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
                                        { max: 100, message: 'Tiêu đề không được quá 100 ký tự!' },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập tiêu đề hấp dẫn cho bài viết"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="content"
                                    label="Nội dung bài viết"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập nội dung bài viết!' },
                                        { min: 100, message: 'Nội dung phải có ít nhất 100 ký tự!' },
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Viết nội dung bài viết tại đây... (Hỗ trợ Markdown)"
                                        rows={15}
                                        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="images"
                                    label="Hình ảnh"
                                >
                                    <ImageUpload maxImages={5} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Form.Item
                                    name="tags"
                                    label="Tags"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn tags phù hợp"
                                        size="large"
                                        maxTagCount={5}
                                        allowClear
                                    >
                                        {predefinedTags.map((tag) => (
                                            <Option key={tag} value={tag}>
                                                {tag}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            loading={loading}
                                            onClick={handlePublish}
                                        >
                                            {post?.status === 'published' ? 'Cập nhật' : 'Xuất bản'}
                                        </Button>
                                        
                                        <Button
                                            type="default"
                                            size="large"
                                            block
                                            loading={loading}
                                            onClick={handleSaveDraft}
                                        >
                                            Lưu bản nháp
                                        </Button>
                                        
                                        <Button
                                            type="default"
                                            size="large"
                                            block
                                            loading={loading}
                                            onClick={handleArchive}
                                            danger={post?.status === 'published'}
                                        >
                                            {post?.status === 'archived' ? 'Đã lưu trữ' : 'Lưu trữ'}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                ) : (
                    <div>
                        <Title level={4}>Chế độ xem trước</Title>
                        <p>Chức năng xem trước sẽ được triển khai tại đây...</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default EditPostForm;
