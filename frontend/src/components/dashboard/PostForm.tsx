'use client';

import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Select,
    Upload,
    Typography,
    Space,
    message,
    Row,
    Col,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    SaveOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PostFormData {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    category: string;
    isPublished: boolean;
}

const PostForm: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const router = useRouter();

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
            // TODO: Replace with actual API call
            console.log('Post data:', values);
            
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            message.success('Post created successfully!');
            router.push('/dashboard/home');
        } catch (error) {
            message.error('Failed to create post. Please try again.');
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
            const values = await form.validateFields();
            values.isPublished = false;
            
            setLoading(true);
            // TODO: Replace with actual API call for saving draft
            console.log('Draft data:', values);
            
            await new Promise((resolve) => setTimeout(resolve, 1000));
            message.success('Draft saved successfully!');
        } catch (error) {
            message.error('Failed to save draft.');
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
                            icon={<SaveOutlined />}
                            onClick={handleSaveDraft}
                            loading={loading}
                        >
                            Save Draft
                        </Button>
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            onClick={() => setPreview(!preview)}
                        >
                            {preview ? 'Edit' : 'Preview'}
                        </Button>
                    </Space>
                }
            >
                {!preview ? (
                    <Form
                        form={form}
                        name="createPost"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        initialValues={{
                            isPublished: true,
                            tags: [],
                        }}
                    >
                        <Row gutter={[16, 0]}>
                            <Col xs={24} lg={16}>
                                <Form.Item
                                    name="title"
                                    label="Post Title"
                                    rules={[
                                        { required: true, message: 'Please input the post title!' },
                                        { min: 5, message: 'Title must be at least 5 characters long!' },
                                        { max: 100, message: 'Title must not exceed 100 characters!' },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter an engaging title for your post"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="excerpt"
                                    label="Post Excerpt"
                                    rules={[
                                        { required: true, message: 'Please input the post excerpt!' },
                                        { min: 20, message: 'Excerpt must be at least 20 characters long!' },
                                        { max: 200, message: 'Excerpt must not exceed 200 characters!' },
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Write a brief summary of your post (this will appear in post previews)"
                                        rows={3}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="content"
                                    label="Post Content"
                                    rules={[
                                        { required: true, message: 'Please input the post content!' },
                                        { min: 100, message: 'Content must be at least 100 characters long!' },
                                    ]}
                                >
                                    <TextArea
                                        placeholder="Write your post content here... (Markdown supported)"
                                        rows={15}
                                        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Form.Item
                                    name="category"
                                    label="Category"
                                    rules={[{ required: true, message: 'Please select a category!' }]}
                                >
                                    <Select
                                        placeholder="Select a category"
                                        size="large"
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
                                    label="Tags"
                                    rules={[
                                        { required: true, message: 'Please select at least one tag!' },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select relevant tags"
                                        size="large"
                                        maxTagCount={5}
                                    >
                                        {predefinedTags.map((tag) => (
                                            <Option key={tag} value={tag}>
                                                {tag}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="coverImage"
                                    label="Cover Image (Optional)"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => {
                                        if (Array.isArray(e)) {
                                            return e;
                                        }
                                        return e?.fileList;
                                    }}
                                >
                                    <Upload
                                        listType="picture-card"
                                        maxCount={1}
                                        beforeUpload={() => false}
                                    >
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        size="large"
                                        block
                                    >
                                        {loading ? 'Publishing...' : 'Publish Post'}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                ) : (
                    <div>
                        <Title level={4}>Preview Mode</Title>
                        <p>Preview functionality would be implemented here...</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default PostForm;
