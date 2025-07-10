'use client';

import React from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Statistic,
    List,
    Avatar,
    Button,
    Space,
    Tag,
    Divider,
} from 'antd';
import {
    FileTextOutlined,
    HeartOutlined,
    EyeOutlined,
    CommentOutlined,
    UserOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

interface Post {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    views: number;
    likes: number;
    comments: number;
    tags: string[];
    createdAt: string;
}

// Mock data - replace with actual API calls
const mockPosts: Post[] = [
    {
        id: '1',
        title: 'Getting Started with Next.js 14',
        excerpt: 'Learn the fundamentals of Next.js 14 and how to build modern web applications...',
        author: 'John Doe',
        views: 1234,
        likes: 45,
        comments: 12,
        tags: ['Next.js', 'React', 'TypeScript'],
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        title: 'Advanced React Patterns',
        excerpt: 'Explore advanced React patterns and best practices for building scalable applications...',
        author: 'Jane Smith',
        views: 892,
        likes: 32,
        comments: 8,
        tags: ['React', 'Patterns', 'Advanced'],
        createdAt: '2024-01-14',
    },
    {
        id: '3',
        title: 'Building APIs with NestJS',
        excerpt: 'Learn how to create robust and scalable APIs using NestJS framework...',
        author: 'Mike Johnson',
        views: 567,
        likes: 28,
        comments: 15,
        tags: ['NestJS', 'API', 'Node.js'],
        createdAt: '2024-01-13',
    },
];

const DashboardHome: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleCreatePost = () => {
        router.push('/dashboard/createPosts');
    };

    const handleViewPost = (postId: string) => {
        router.push(`/dashboard/posts/${postId}`);
    };

    return (
        <div>
            {/* Welcome Section */}
            <Card style={{ marginBottom: 24 }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            Welcome back, {session?.user?.username || 'User'}! 👋
                        </Title>
                        <Paragraph style={{ margin: '8px 0 0 0', fontSize: 16, color: '#666' }}>
                            Ready to share your knowledge with the developer community?
                        </Paragraph>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={handleCreatePost}
                        >
                            Create New Post
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Posts"
                            value={12}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Views"
                            value={2847}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Likes"
                            value={156}
                            prefix={<HeartOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Comments"
                            value={89}
                            prefix={<CommentOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Posts */}
            <Card
                title={
                    <Space>
                        <FileTextOutlined />
                        <span>Recent Posts</span>
                    </Space>
                }
                extra={
                    <Button type="link" onClick={() => router.push('/dashboard/myPosts')}>
                        View All
                    </Button>
                }
            >
                <List
                    itemLayout="vertical"
                    dataSource={mockPosts}
                    renderItem={(post) => (
                        <List.Item
                            key={post.id}
                            actions={[
                                <Space key="views">
                                    <EyeOutlined />
                                    {post.views}
                                </Space>,
                                <Space key="likes">
                                    <HeartOutlined />
                                    {post.likes}
                                </Space>,
                                <Space key="comments">
                                    <CommentOutlined />
                                    {post.comments}
                                </Space>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={
                                    <Button
                                        type="link"
                                        onClick={() => handleViewPost(post.id)}
                                        style={{ padding: 0, height: 'auto', fontWeight: 600 }}
                                    >
                                        {post.title}
                                    </Button>
                                }
                                description={
                                    <Space direction="vertical" size={4}>
                                        <Text type="secondary">
                                            by {post.author} • {post.createdAt}
                                        </Text>
                                        <Space wrap>
                                            {post.tags.map((tag) => (
                                                <Tag key={tag} color="blue">
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </Space>
                                    </Space>
                                }
                            />
                            <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>
                                {post.excerpt}
                            </Paragraph>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default DashboardHome;
