'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Tag,
    Typography,
    Input,
    Select,
    Dropdown,
    App,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    MoreOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { ColumnsType } from 'antd/es/table';
import { getMyPosts, deletePost, getPostByIdForOwner } from '@/utils/postApi';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Post {
    _id: string;
    title: string;
    content: string;
    status: 'published' | 'draft' | 'archived';
    tags: string[];
    viewCount: number;
    likes: string[];
    createdAt: string;
    updatedAt: string;
    authorId: {
        _id: string;
        username: string;
    };
}

// Mock data
const mockPosts: Post[] = [];

const MyPostsList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const router = useRouter();
    const { message, modal } = App.useApp();
    const { data: session } = useSession();

    // Fetch posts when component mounts
    useEffect(() => {
        const fetchMyPosts = async () => {
            if (!session?.user) return;
            
            setLoading(true);
            try {
                const data = await getMyPosts();
                setPosts(data as Post[]);
            } catch (error: any) {
                console.error('Error fetching my posts:', error);
                
                // Handle authentication errors specifically
                if (error.response?.status === 401) {
                    message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    router.push('/auth/login');
                } else {
                    message.error('Không thể tải danh sách bài viết');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [session?.user, message, router]);

    const handleEdit = (postId: string) => {
        router.push(`/dashboard/editPost/${postId}`);
    };

    const handleView = (postId: string) => {
        router.push(`/dashboard/posts/${postId}`);
    };

    const handleDelete = async (postId: string) => {
        modal.confirm({
            title: 'Are you sure you want to delete this post?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deletePost(postId);
                    setPosts(posts.filter(post => post._id !== postId));
                    message.success('Post deleted successfully');
                } catch (error) {
                    console.error('Error deleting post:', error);
                    message.error('Không thể xóa bài viết');
                }
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'green';
            case 'draft':
                return 'orange';
            case 'archived':
                return 'red';
            default:
                return 'default';
        }
    };

    const columns: ColumnsType<Post> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (title, record) => (
                <Button
                    type="link"
                    onClick={() => handleView(record._id)}
                    style={{ padding: 0, height: 'auto', textAlign: 'left' }}
                >
                    {title}
                </Button>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
                { text: 'Archived', value: 'archived' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: string[]) => (
                <Space wrap>
                    {tags.slice(0, 2).map(tag => (
                        <Tag key={tag} color="blue" style={{ margin: '2px' }}>
                            {tag}
                        </Tag>
                    ))}
                    {tags.length > 2 && (
                        <Tag color="default">+{tags.length - 2}</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Views',
            dataIndex: 'viewCount',
            key: 'viewCount',
            sorter: (a, b) => a.viewCount - b.viewCount,
            render: (viewCount) => viewCount.toLocaleString(),
        },
        {
            title: 'Likes',
            dataIndex: 'likes',
            key: 'likes',
            sorter: (a, b) => a.likes.length - b.likes.length,
            render: (likes: string[]) => likes.length,
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (createdAt) => new Date(createdAt).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
            render: (updatedAt) => new Date(updatedAt).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'view',
                                label: 'View',
                                icon: <EyeOutlined />,
                                onClick: () => handleView(record._id),
                            },
                            {
                                key: 'edit',
                                label: 'Edit',
                                icon: <EditOutlined />,
                                onClick: () => handleEdit(record._id),
                            },
                            {
                                type: 'divider',
                            },
                            {
                                key: 'delete',
                                label: 'Delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDelete(record._id),
                            },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                             post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <Card
                title={
                    <Space>
                        <Title level={3} style={{ margin: 0 }}>
                            My Posts
                        </Title>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/dashboard/createPosts')}
                    >
                        Create New Post
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <Search
                            placeholder="Search posts..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 120 }}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="published">Published</Option>
                            <Option value="draft">Draft</Option>
                            <Option value="archived">Archived</Option>
                        </Select>
                    </Space>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredPosts}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        total: filteredPosts.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} posts`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>
        </div>
    );
};

export default MyPostsList;
