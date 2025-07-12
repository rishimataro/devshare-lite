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
    Divider,
    Switch,
    Alert
} from 'antd';
import {
    PlusOutlined,
    SaveOutlined,
    EyeOutlined,
    EditOutlined,
    SendOutlined,
    PictureOutlined,
    FileTextOutlined,
    TagsOutlined
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
            
            console.log('Sending post data:', postData);
            const result = await createPost(postData);
            console.log('Post creation result:', result);
            
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
                const errorMessage = error.response?.data?.message || error.message || 'Failed to create post. Please try again.';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('Please fill in all required fields correctly.');
    };

    const handleSaveDraft = async () => {
        try {
            const values = await form.getFieldsValue();
            
            if (!values.title || !values.content) {
                message.error('Please fill in at least title and content to save as draft.');
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
            message.success('Draft saved successfully!');
            router.push('/dashboard/myPosts');
        } catch (error: any) {
            console.error('Error saving draft:', error);
            
            // Handle specific error cases
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                router.push('/auth/login');
            } else if (error.message === 'No authentication token found') {
                message.error('Bạn cần đăng nhập để lưu bài viết.');
                router.push('/auth/login');
            } else {
                // Display specific error message if available
                const errorMessage = error.response?.data?.message || error.message || 'Failed to save draft.';
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
                            Create New Post
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
                            console.log('PostForm: Form values changed:', allValues);
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
                                        { required: true, message: 'Please input the post title!' },
                                        { min: 5, message: 'Title must be at least 5 characters long!' },
                                        { max: 100, message: 'Title must not exceed 100 characters!' },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter an engaging title for your post"
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
                                        { required: true, message: 'Please input the post content!' },
                                        { min: 100, message: 'Content must be at least 100 characters long!' },
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Write your post content here... (Markdown supported)"
                                        rows={15}
                                        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                                        onChange={(e) => setContentLength(e.target.value.length)}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="images"
                                    label="Post Images (Optional)"
                                    help="Upload images for your post. Maximum 5 images."
                                >
                                    <ImageUpload maxImages={5} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Form.Item
                                    name="category"
                                    label="Category (Optional)"
                                >
                                    <Select
                                        placeholder="Select a category"
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
                                    label="Tags (Optional)"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select relevant tags"
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
                                    label="Publish Status"
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
                                        {loading ? 'Publishing...' : 'Publish Post'}
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
                                        {loading ? 'Saving...' : 'Save as Draft'}
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
