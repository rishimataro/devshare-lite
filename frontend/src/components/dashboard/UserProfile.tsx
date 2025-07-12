'use client';
import React, { useState, useEffect } from 'react';
import {
    Card,
    Avatar,
    Typography,
    Button,
    Space,
    Tabs,
    List,
    Tag,
    Divider,
    App,
    Spin,
    Row,
    Col,
    Statistic
} from 'antd';
import {
    UserOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    FileTextOutlined,
    HeartOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    profile?: {
        bio: string;
        avatar: string;
    };
    following: any[];
    followers: any[];
    followingCount: number;
    followerCount: number;
    createdAt: string;
}

interface Post {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    status: string;
    viewCount: number;
    likes: string[];
    createdAt: string;
    updatedAt: string;
}

interface UserProfileProps {
    userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { message } = App.useApp();

    useEffect(() => {
        fetchUserProfile();
        fetchUserPosts();
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get(`/users/${userId}/profile`);
            const userData = response.data as UserProfile;
            setUser(userData);

            if (session?.user?._id && userData.followers) {
                const isFollowingUser = userData.followers.some(
                    (follower: any) => follower._id === session.user._id
                );
                setIsFollowing(isFollowingUser);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            message.error('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await api.get(`/posts?authorId=${userId}`);
            const postsData = response.data as { data: Post[] };
            setUserPosts(postsData.data || []);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    const handleFollow = async () => {
        if (!session) {
            message.error('Vui lòng đăng nhập để follow');
            return;
        }

        setFollowLoading(true);
        try {
            if (isFollowing) {
                await api.post(`/users/${userId}/unfollow`);
                message.success('Đã unfollow');
                setIsFollowing(false);
            } else {
                await api.post(`/users/${userId}/follow`);
                message.success('Đã follow');
                setIsFollowing(true);
            }
            fetchUserProfile();
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
            message.error('Không thể thực hiện hành động này');
        } finally {
            setFollowLoading(false);
        }
    };

    const handlePostClick = (postId: string) => {
        router.push(`/dashboard/posts/${postId}`);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text>Không tìm thấy người dùng</Text>
            </div>
        );
    }

    const isOwnProfile = session?.user?._id === userId;

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
            {/* Profile Header */}
            <Card>
                <Row align="middle" gutter={24}>
                    <Col>
                        <Avatar
                            size={100}
                            src={user.profile?.avatar}
                            icon={<UserOutlined />}
                        />
                    </Col>
                    <Col flex="auto">
                        <Title level={2} style={{ margin: 0 }}>
                            {user.username}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                            {user.email}
                        </Text>
                        {user.profile?.bio && (
                            <Paragraph style={{ marginTop: 8 }}>
                                {user.profile.bio}
                            </Paragraph>
                        )}
                        <Space style={{ marginTop: 16 }}>
                            <Statistic
                                title="Đang theo dõi"
                                value={user.followingCount}
                                prefix={<UserAddOutlined />}
                            />
                            <Statistic
                                title="Người theo dõi"
                                value={user.followerCount}
                                prefix={<UserOutlined />}
                            />
                            <Statistic
                                title="Bài viết"
                                value={userPosts.length}
                                prefix={<FileTextOutlined />}
                            />
                        </Space>
                    </Col>
                    <Col>
                        {!isOwnProfile && session && (
                            <Button
                                type={isFollowing ? "default" : "primary"}
                                icon={isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
                                onClick={handleFollow}
                                loading={followLoading}
                                size="large"
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card>

            {/* Profile Content */}
            <Card style={{ marginTop: 24 }}>
                <Tabs
                    defaultActiveKey="posts"
                    items={[
                        {
                            key: 'posts',
                            label: 'Bài viết',
                            children: (
                                <List
                                    dataSource={userPosts}
                                    renderItem={post => (
                                        <List.Item
                                            key={post._id}
                                            actions={[
                                                <Space key="stats">
                                                    <EyeOutlined /> {post.viewCount}
                                                    <HeartOutlined /> {post.likes?.length || 0}
                                                </Space>
                                            ]}
                                            onClick={() => handlePostClick(post._id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <List.Item.Meta
                                                title={
                                                    <Space>
                                                        <span>{post.title}</span>
                                                        <Tag color={post.status === 'published' ? 'green' : 'orange'}>
                                                            {post.status}
                                                        </Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space direction="vertical" size="small">
                                                        <Text>{post.content.substring(0, 200)}...</Text>
                                                        <Space>
                                                            {post.tags.map(tag => (
                                                                <Tag key={tag} color="blue">
                                                                    {tag}
                                                                </Tag>
                                                            ))}
                                                        </Space>
                                                        <Text type="secondary">
                                                            {dayjs(post.createdAt).format('DD/MM/YYYY')}
                                                        </Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    locale={{
                                        emptyText: 'Chưa có bài viết nào'
                                    }}
                                />
                            )
                        },
                        {
                            key: 'following',
                            label: 'Đang theo dõi',
                            children: (
                                <List
                                    dataSource={user.following}
                                    renderItem={followingUser => (
                                        <List.Item
                                            key={followingUser._id}
                                            onClick={() => router.push(`/dashboard/profile/${followingUser._id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        src={followingUser.profile?.avatar}
                                                        icon={<UserOutlined />}
                                                    />
                                                }
                                                title={followingUser.username}
                                                description={followingUser.email}
                                            />
                                        </List.Item>
                                    )}
                                    locale={{
                                        emptyText: 'Chưa theo dõi ai'
                                    }}
                                />
                            )
                        },
                        {
                            key: 'followers',
                            label: 'Người theo dõi',
                            children: (
                                <List
                                    dataSource={user.followers}
                                    renderItem={follower => (
                                        <List.Item
                                            key={follower._id}
                                            onClick={() => router.push(`/dashboard/profile/${follower._id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        src={follower.profile?.avatar}
                                                        icon={<UserOutlined />}
                                                    />
                                                }
                                                title={follower.username}
                                                description={follower.email}
                                            />
                                        </List.Item>
                                    )}
                                    locale={{
                                        emptyText: 'Chưa có người theo dõi'
                                    }}
                                />
                            )
                        }
                    ]}
                />
            </Card>
        </div>
    );
};

export default UserProfile;
