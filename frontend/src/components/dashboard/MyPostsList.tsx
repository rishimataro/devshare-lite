'use client';

import React, { useState } from 'react';
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
    Modal,
    message,
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
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Post {
    key: string;
    id: string;
    title: string;
    status: 'published' | 'draft' | 'archived';
    category: string;
    tags: string[];
    views: number;
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
}

// Mock data
const mockPosts: Post[] = [
    {
        key: '1',
        id: '1',
        title: 'Getting Started with Next.js 14',
        status: 'published',
        category: 'Web Development',
        tags: ['Next.js', 'React', 'TypeScript'],
        views: 1234,
        likes: 45,
        comments: 12,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16',
    },
    {
        key: '2',
        id: '2',
        title: 'Advanced React Patterns',
        status: 'draft',
        category: 'Web Development',
        tags: ['React', 'Patterns', 'Advanced'],
        views: 0,
        likes: 0,
        comments: 0,
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14',
    },
    {
        key: '3',
        id: '3',
        title: 'Building APIs with NestJS',
        status: 'published',
        category: 'Backend Development',
        tags: ['NestJS', 'API', 'Node.js'],
        views: 567,
        likes: 28,
        comments: 15,
        createdAt: '2024-01-13',
        updatedAt: '2024-01-13',
    },
];

const MyPostsList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const router = useRouter();

    const handleEdit = (postId: string) => {
        router.push(`/dashboard/editPost/${postId}`);
    };

    const handleView = (postId: string) => {
        router.push(`/dashboard/posts/${postId}`);
    };

    const handleDelete = (postId: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this post?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                setPosts(posts.filter(post => post.id !== postId));
                message.success('Post deleted successfully');
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
                    onClick={() => handleView(record.id)}
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
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category),
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
            dataIndex: 'views',
            key: 'views',
            sorter: (a, b) => a.views - b.views,
            render: (views) => views.toLocaleString(),
        },
        {
            title: 'Likes',
            dataIndex: 'likes',
            key: 'likes',
            sorter: (a, b) => a.likes - b.likes,
        },
        {
            title: 'Comments',
            dataIndex: 'comments',
            key: 'comments',
            sorter: (a, b) => a.comments - b.comments,
        },
        {
            title: 'Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
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
                                onClick: () => handleView(record.id),
                            },
                            {
                                key: 'edit',
                                label: 'Edit',
                                icon: <EditOutlined />,
                                onClick: () => handleEdit(record.id),
                            },
                            {
                                type: 'divider',
                            },
                            {
                                key: 'delete',
                                label: 'Delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDelete(record.id),
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
                             post.category.toLowerCase().includes(searchText.toLowerCase());
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
