'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, Avatar, Space, Divider, Form } from 'antd';
import { 
    UserOutlined, 
    CalendarOutlined, 
    PictureOutlined,
    EyeOutlined 
} from '@ant-design/icons';
import ImageGallery from './ImageGallery';
import MarkdownRenderer from './MarkdownRenderer';

const { Title } = Typography;

interface PostPreviewProps {
    form?: any;
    data?: {
        title?: string;
        content?: string;
        images?: string[];
        category?: string;
        tags?: string[];
        author?: {
            name?: string;
            avatar?: string;
        };
        createdAt?: string;
    };
    showGuide?: boolean;
    showHeader?: boolean;
    className?: string;
}

const PostPreview: React.FC<PostPreviewProps> = ({ 
    form, 
    data,
    showHeader = true,
    className = ''
}) => {
    const [formData, setFormData] = useState<any>({});

    let watchedData: any = {};
    try {
        if (form) {
            const title = Form.useWatch('title', form);
            const content = Form.useWatch('content', form);
            const tags = Form.useWatch('tags', form);
            const images = Form.useWatch('images', form);
            const category = Form.useWatch('category', form);
            
            watchedData = {
                title: title || '',
                content: content || '',
                tags: tags || [],
                images: images || [],
                category: category || ''
            };
        }
    } catch (error) {
        console.warn('Form.useWatch failed, falling back to manual method:', error);
    }

    useEffect(() => {
        const updateFormData = () => {
            
            if (form) {
                try {
                    const values = form.getFieldsValue();

                    const titleValue = form.getFieldValue('title');
                    const contentValue = form.getFieldValue('content');
                    
                    setFormData(values);
                } catch (error) {
                    console.error('Error getting form values:', error);
                }
            } else if (data) {
                setFormData(data);
                console.log('PostPreview: Using provided data:', data);
            }
        };

        updateFormData();

        const interval = setInterval(updateFormData, 500);

        return () => clearInterval(interval);
    }, [form, data]);

    const finalFormData = {
        title: data?.title || watchedData.title || formData.title || '',
        content: data?.content || watchedData.content || formData.content || '',
        tags: data?.tags || watchedData.tags || formData.tags || [],
        images: data?.images || watchedData.images || formData.images || [],
        category: data?.category || watchedData.category || formData.category || '',
        author: data?.author,
        createdAt: data?.createdAt
    };

    const formatDate = (dateString?: string) => {
        const date = dateString ? new Date(dateString) : new Date();
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }} className={className}>
            {showHeader && (
                <Title level={4} style={{ marginBottom: '24px', color: '#1890ff' }}>
                    <EyeOutlined /> Preview Mode
                </Title>
            )}
            
            <Card style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                {/* Post Header */}
                <div style={{ marginBottom: '16px' }}>
                    <Space>
                        <Avatar 
                            size={40} 
                            icon={<UserOutlined />} 
                            src={finalFormData.author?.avatar}
                        />
                        <div>
                            <Typography.Text strong>
                                {finalFormData.author?.name || 'Your Name'}
                            </Typography.Text>
                            <br />
                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                                <CalendarOutlined /> {formatDate(finalFormData.createdAt)}
                            </Typography.Text>
                        </div>
                    </Space>
                </div>

                <Divider />

                {/* Post Title */}
                <Typography.Title level={2} style={{ marginBottom: '16px', color: '#262626' }}>
                    {finalFormData.title || 'Tiêu đề bài viết...'}
                </Typography.Title>

                {/* Post Content */}
                <div style={{ marginBottom: '20px' }}>
                    <MarkdownRenderer content={finalFormData.content} />
                </div>

                {/* Images Section */}
                {finalFormData.images && finalFormData.images.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <Typography.Title level={5} style={{ marginBottom: '12px', color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <PictureOutlined /> Hình ảnh ({finalFormData.images.length})
                        </Typography.Title>
                        <ImageGallery 
                            images={finalFormData.images} 
                            title={finalFormData.title}
                            layout={finalFormData.images.length === 1 ? "single" : "grid"}
                            showCounter={true}
                            showThumbnails={finalFormData.images.length > 1}
                            maxHeight={finalFormData.images.length === 1 ? 300 : 200}
                            className="preview-image-gallery"
                        />
                    </div>
                )}

                {/* Category */}
                {finalFormData.category && (
                    <div style={{ marginBottom: '16px' }}>
                        <Typography.Text strong>Danh mục: </Typography.Text>
                        <Tag color="blue">{finalFormData.category}</Tag>
                    </div>
                )}

                {/* Tags */}
                {finalFormData.tags && finalFormData.tags.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <Typography.Text strong>Tags: </Typography.Text>
                        <Space wrap style={{ marginTop: '8px' }}>
                            {finalFormData.tags.map((tag: string, index: number) => (
                                <Tag key={index} color="blue">
                                    {tag}
                                </Tag>
                            ))}
                        </Space>
                    </div>
                )}

                {/* Preview Note */}
                <Divider />
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    Đây là bản xem trước bài đăng của bạn sẽ hiển thị như thế nào với người đọc.
                </Typography.Text>
            </Card>
            
        </div>
    );
};

export default PostPreview;
