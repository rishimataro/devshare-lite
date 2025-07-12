'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';
import {
    Card,
    Typography,
    Button,
    Space,
    Tag,
    Avatar,
    Divider,
    App,
    Spin,
} from 'antd';
import {
    ArrowLeftOutlined,
    EyeOutlined,
    HeartOutlined,
    HeartFilled,
    UserOutlined,
    PictureOutlined,
} from '@ant-design/icons';
import DashboardLayout from '@/components/layout/dashboadLayout';
import { getPostById, likePost, getPostByIdForOwner } from '@/utils/postApi';
import CommentSection from '@/components/dashboard/CommentSection';
import ImageGallery from '@/components/common/ImageGallery';

const { Title, Text, Paragraph } = Typography;

interface Post {
    _id: string;
    title: string;
    content: string;
    status: 'published' | 'draft' | 'archived';
    authorId: {
        _id: string;
        username: string;
        email: string;
    };
    viewCount: number;
    likes: string[];
    tags: string[];
    images: string[];
    createdAt: string;
    updatedAt: string;
}

const PostDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);
    const { message } = App.useApp();

    const postId = params.id as string;

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            
            setLoading(true);
            try {
                // Kiểm tra nếu đang truy cập từ dashboard/posts thì sử dụng API owner
                const isOwnerView = window.location.pathname.includes('/dashboard/posts/');
                let data;
                
                if (isOwnerView && session?.user) {
                    // Sử dụng API owner để có thể xem bài viết chưa published
                    data = await getPostByIdForOwner(postId);
                } else {
                    // Sử dụng API public chỉ xem được bài viết published
                    data = await getPostById(postId);
                }
                
                setPost(data as Post);
            } catch (error) {
                console.error('Error fetching post:', error);
                message.error('Không thể tải bài viết');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, session?.user]);

    const handleLike = async () => {
        if (!session?.user || !post) return;

        // Không thể like bài viết chưa published
        if (post.status !== 'published') {
            message.warning('Không thể like bài viết chưa công khai');
            return;
        }

        setLiking(true);
        try {
            await likePost(post._id);
            // Refresh post data after like
            const updatedPost = await getPostById(post._id);
            setPost(updatedPost as Post);
            message.success('Đã cập nhật like');
        } catch (error: any) {
            console.error('Error liking post:', error);
            
            // Handle specific error cases
            if (error.response?.status === 401) {
                message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                // Don't redirect here, let user decide
            } else if (error.message === 'No authentication token found') {
                message.error('Bạn cần đăng nhập để like bài viết.');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Không thể like bài viết';
                message.error(errorMessage);
            }
        } finally {
            setLiking(false);
        }
    };

    const isLiked = post?.likes?.includes(session?.user?._id ?? '') || false;

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>Đang tải bài viết...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!post) {
        return (
            <DashboardLayout>
                <Card>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Title level={4}>Không tìm thấy bài viết</Title>
                        <Button onClick={() => router.back()}>
                            <ArrowLeftOutlined /> Quay lại
                        </Button>
                    </div>
                </Card>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <Button 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => router.back()}
                        style={{ marginBottom: 16 }}
                    >
                        Quay lại
                    </Button>
                </div>

                {/* Post Content */}
                <Card>
                    {/* Status Badge for non-published posts */}
                    {post.status !== 'published' && (
                        <div style={{ marginBottom: 16 }}>
                            <Tag color={post.status === 'draft' ? 'orange' : 'red'} style={{ fontSize: 14, padding: '4px 8px' }}>
                                {post.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                            </Tag>
                        </div>
                    )}

                    {/* Title */}
                    <Title level={1} style={{ marginBottom: 16 }}>
                        {post.title}
                    </Title>

                    {/* Author Info */}
                    <div style={{ marginBottom: 16 }}>
                        <Space>
                            <Avatar icon={<UserOutlined />} />
                            <div>
                                <Text strong>{post.authorId?.username || 'Unknown'}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')} • 
                                    <EyeOutlined style={{ marginLeft: 8, marginRight: 4 }} />
                                    {post.viewCount} lượt xem
                                </Text>
                            </div>
                        </Space>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <Space wrap>
                                {post.tags.map((tag, index) => (
                                    <Tag key={index} color="blue">
                                        {tag}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    )}

                    {/* Images Section - Enhanced Display */}
                    {post.images && post.images.length > 0 && (
                        <>
                            <Divider />
                            <div style={{ marginBottom: 24 }}>
                                <Title level={4} style={{ marginBottom: 16, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <PictureOutlined />
                                    Hình ảnh đính kèm ({post.images.length})
                                </Title>
                                <ImageGallery 
                                    images={post.images} 
                                    title={post.title}
                                    layout={post.images.length === 1 ? "single" : post.images.length <= 3 ? "grid" : "carousel"}
                                    showCounter={true}
                                    showThumbnails={post.images.length > 1}
                                    maxHeight={post.images.length === 1 ? 500 : 350}
                                    className="post-image-gallery"
                                />
                                {post.images.length > 1 && (
                                    <div style={{ 
                                        marginTop: 12, 
                                        padding: '8px 12px', 
                                        background: '#f0f7ff', 
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: '#666',
                                        textAlign: 'center'
                                    }}>
                                        💡 <strong>Mẹo:</strong> Click vào ảnh để xem phóng to • Dùng phím mũi tên ← → để chuyển ảnh • Nhấn ESC để đóng
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <Divider />

                    {/* Content */}
                    <div style={{ marginBottom: 24 }}>
                        <div className="markdown-content" style={{ 
                            fontSize: 16, 
                            lineHeight: '1.8'
                        }}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => <Title level={2} style={{ marginTop: '32px', marginBottom: '16px' }}>{children}</Title>,
                                    h2: ({ children }) => <Title level={3} style={{ marginTop: '24px', marginBottom: '12px' }}>{children}</Title>,
                                    h3: ({ children }) => <Title level={4} style={{ marginTop: '20px', marginBottom: '10px' }}>{children}</Title>,
                                    p: ({ children }) => <Paragraph style={{ fontSize: 16, lineHeight: 1.8, marginBottom: '16px' }}>{children}</Paragraph>,
                                    code: ({ children, className, ...props }: any) => {
                                        const isInline = !className || !className.includes('language-');
                                        return isInline ? 
                                        <code style={{ background: '#f5f5f5', padding: '2px 4px', borderRadius: '3px', fontSize: '14px' }} {...props}>
                                            {children}
                                        </code> :
                                        <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px', overflow: 'auto', margin: '16px 0' }}>
                                            <code className={className} {...props}>{children}</code>
                                        </pre>
                                    },
                                    blockquote: ({ children }) => (
                                        <div style={{ 
                                            borderLeft: '4px solid #1890ff', 
                                            paddingLeft: '16px', 
                                            margin: '16px 0', 
                                            fontStyle: 'italic',
                                            background: '#f9f9f9',
                                            padding: '16px',
                                            borderRadius: '6px'
                                        }}>
                                            {children}
                                        </div>
                                    ),
                                    ul: ({ children }) => (
                                        <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li style={{ marginBottom: '8px' }}>{children}</li>
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <Divider />

                    {/* Actions */}
                    <div style={{ textAlign: 'center' }}>
                        <Space size="large">
                            <Button
                                type={isLiked ? "primary" : "default"}
                                icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                                onClick={handleLike}
                                loading={liking}
                                disabled={!session?.user || post.status !== 'published'}
                            >
                                {post.likes.length} {isLiked ? 'Đã thích' : 'Thích'}
                            </Button>
                        </Space>
                    </div>
                </Card>

                {/* Comments Section - Only show for published posts */}
                {post.status === 'published' && (
                    <CommentSection postId={post._id} />
                )}
                
                {/* Message for non-published posts */}
                {post.status !== 'published' && (
                    <Card style={{ marginTop: 16 }}>
                        <div style={{ textAlign: 'center', color: '#666' }}>
                            <Text type="secondary">
                                {post.status === 'draft' 
                                    ? 'Bài viết này đang ở trạng thái bản nháp. Bình luận sẽ được kích hoạt khi bài viết được công khai.'
                                    : 'Bài viết này đã được lưu trữ. Bình luận đã bị vô hiệu hóa.'
                                }
                            </Text>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PostDetailPage;
