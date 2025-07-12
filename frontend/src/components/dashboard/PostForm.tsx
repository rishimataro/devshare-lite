'use client';

import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Select,
    Typography,
    Space,
    App,
    Row,
    Col,
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { createPost } from '@/utils/postApi';
import ImageUpload from '@/components/input/ImageUpload';
import PostPreview from '@/components/common/PostPreview';
import FormCharacterCounter from '@/components/common/FormCharacterCounter';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PostFormData {
    title: string;
    content: string;
    tags: string[];
    category: string;
    images: string[];
    isPublished: boolean;
}

const PostForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [titleLength, setTitleLength] = useState(0);
    const [contentLength, setContentLength] = useState(0);
    const [formValues, setFormValues] = useState<any>({}); // Add this to track form values
    const router = useRouter();
    const { message } = App.useApp();

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

    const categories = [
        'Web Development',
        'Mobile Development',
        'Backend Development',
        'DevOps',
        'Database',
        'UI/UX',
        'Programming Languages',
        'Frameworks',
        'Tools & Libraries',
        'Career & Learning',
        'Other',
    ];

    const onFinish = async (values: PostFormData) => {
        setLoading(true);
        try {
            const postData = {
                title: values.title,
                content: values.content,
                tags: values.tags || [],
                images: values.images || [],
                status: (values.isPublished ? 'published' : 'draft') as 'published' | 'draft'
            };
            
            const result = await createPost(postData);
            
            message.success('Post created successfully!');
            router.push('/dashboard/home');
        } catch (error: any) {
            console.error('Error creating post:', error);
            
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router.push('/auth/login');
            } else if (error.message === 'No authentication token found') {
                message.error('Bạn cần đăng nhập để tạo bài viết.');
                router.push('/auth/login');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể tạo bài viết. Vui lòng thử lại';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
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
                status: 'draft' as const
            };
            
            await createPost(postData);
            message.success('Đã lưu bản nháp thành công!');
            router.push('/dashboard/myPosts');
        } catch (error: any) {
            console.error('Error saving draft:', error);
            
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router.push('/auth/login');
            } else if (error.message === 'No authentication token found') {
                message.error('Bạn cần đăng nhập để lưu bài viết.');
                router.push('/auth/login');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Lỗi lưu bản nháp. Vui lòng thử lại.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Card
                title={
                    <Space>
                        <PlusOutlined />
                        <Title level={3} style={{ margin: 0 }}>
                            Tạo bài viết mới
                        </Title>
                    </Space>
                }
                extra={
                    <Space>
                        <Button
                            type={preview ? "primary" : "default"}
                            icon={<EyeOutlined />}
                            onClick={() => setPreview(!preview)}
                        >
                            {preview ? 'Edit Mode' : 'Preview Mode'}
                        </Button>
                    </Space>
                }
            >
                {preview ? (
                    <PostPreview form={form} data={formValues} />
                ) : (
                    <Form
                        form={form}
                        name="createPost"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onValuesChange={(changedValues, allValues) => {
                            setFormValues(allValues);
                        }}
                        layout="vertical"
                        initialValues={{
                            isPublished: false,
                            tags: [],
                            images: [],
                        }}
                    >
                        <Row gutter={[16, 0]}>
                            <Col xs={24} lg={16}>
                                <Form.Item
                                    name="title"
                                    label={
                                        <span>
                                            Post Title 
                                            <FormCharacterCounter
                                                current={titleLength}
                                                max={100}
                                                style={{ float: 'right' }}
                                            />
                                        </span>
                                    }
                                    rules={[
                                        { required: true, message: 'Vui lòng điền tiêu đề' },
                                        { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
                                        { max: 100, message: 'Tiêu đề không được vượt quá 100 ký tự' },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập tiêu đề hấp dẫn cho bài viết của bạn"
                                        size="large"
                                        onChange={(e) => setTitleLength(e.target.value.length)}
                                        showCount
                                        maxLength={100}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="content"
                                    label={
                                        <span>
                                            Post Content 
                                            <FormCharacterCounter
                                                current={contentLength}
                                                min={100}
                                                showMin={true}
                                                showMax={false}
                                                style={{ float: 'right' }}
                                            />
                                        </span>
                                    }
                                    rules={[
                                        { required: true, message: 'Vui lòng điền nội dung bài viết!' },
                                        { min: 100, message: 'Nội dung phải có ít nhất 100 ký tự!' },
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Nhập nội dung bài viết của bạn ở đây... (Hỗ trợ Markdown)"
                                        rows={15}
                                        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                                        onChange={(e) => setContentLength(e.target.value.length)}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="images"
                                    label="Hình ảnh bài viết (Tùy chọn)"
                                    help="Hãy tải lên hình ảnh liên quan đến bài viết của bạn. Tối đa 5 hình ảnh."
                                >
                                    <ImageUpload maxImages={5} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Form.Item
                                    name="category"
                                    label="Category (Tùy chọn)"
                                >
                                    <Select
                                        placeholder="Chọn category"
                                        size="large"
                                        allowClear
                                    >
                                        {categories.map((category) => (
                                            <Option key={category} value={category}>
                                                {category}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="tags"
                                    label="Tags (Tùy chọn)"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Chọn một hoặc nhiều tags"
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

                                <Form.Item
                                    name="isPublished"
                                    label="Tình trang đăng tải"
                                    valuePropName="checked"
                                >
                                    <Button 
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        size="large"
                                        block
                                        onClick={() => form.setFieldsValue({ isPublished: true })}
                                    >
                                        {loading ? 'Đang xuất...' : 'Xuất bản'}
                                    </Button>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="default"
                                        loading={loading}
                                        size="large"
                                        block
                                        onClick={() => {
                                            form.setFieldsValue({ isPublished: false });
                                            handleSaveDraft();
                                        }}
                                    >
                                        {loading ? 'Đang lưu...' : 'Lưu bản nháp'}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default PostForm;
