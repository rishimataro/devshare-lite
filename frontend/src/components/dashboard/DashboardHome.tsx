'use client';

import React, { useEffect, useState } from 'react';
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
    _id: string;
    title: string;
    content: string;
    authorId: {
        _id: string;
        username: string;
        email: string;
    };
    viewCount: number;
    likes: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

import { getPosts } from '@/utils/postApi';

const DashboardHome: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                console.log('Fetching posts from API...');
                const data = await getPosts();
                console.log('Posts received:', data);
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

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
                    dataSource={posts}
                    loading={loading}
                    renderItem={(post) => (
                        <List.Item
                            key={post._id}
                            actions={[
                                <Space key="views">
                                    <EyeOutlined />
                                    {post.viewCount}
                                </Space>,
                                <Space key="likes">
                                    <HeartOutlined />
                                    {post.likes.length}
                                </Space>,
                                <Space key="comments">
                                    <CommentOutlined />
                                    0
                                </Space>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={
                                    <Button
                                        type="link"
                                        onClick={() => handleViewPost(post._id)}
                                        style={{ padding: 0, height: 'auto', fontWeight: 600 }}
                                    >
                                        {post.title}
                                    </Button>
                                }
                                description={
                                    <Space direction="vertical" size={4}>
                                        <Text type="secondary">
                                            by {post.authorId?.username || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                                        </Text>
                                        <Space wrap>
                                            {post.tags?.map((tag, index) => (
                                                <Tag key={index} color="blue">
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </Space>
                                    </Space>
                                }
                            />
                            <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>
                                {post.content.substring(0, 150)}...
                            </Paragraph>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default DashboardHome;
