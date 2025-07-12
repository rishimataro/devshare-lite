'use client';

import React, { useState, useEffect } from 'react';
import { Button, Typography, Tooltip, Spin } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    ExpandOutlined,
    PictureOutlined,
} from '@ant-design/icons';

interface ImageGalleryProps {
    images: string[];
    title?: string;
    layout?: 'grid' | 'carousel' | 'single';
    showCounter?: boolean;
    showThumbnails?: boolean;
    maxHeight?: number;
    className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    title,
    layout = 'grid',
    showCounter = true,
    showThumbnails = true,
    maxHeight = 300,
    className = ''
}) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState<{[key: number]: boolean}>({});

    if (!images || images.length === 0) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                border: '2px dashed var(--color-accent)',
                borderRadius: '8px',
                background: 'var(--color-primary-light)'
            }} className={className}>
                <PictureOutlined style={{ fontSize: '48px', color: 'var(--color-accent)', marginBottom: '16px' }} />
                <Typography.Text type="secondary">
                    Chưa có hình ảnh nào
                </Typography.Text>
            </div>
        );
    }

    const handleImageClick = (index: number) => {
        setCurrentIndex(index);
        setPreviewVisible(true);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (previewVisible) {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') setPreviewVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [previewVisible]);

    const getGridColumns = () => {
        if (layout === 'single') return '1fr';
        if (layout === 'carousel') return '1fr';
        
        return images.length === 1 
            ? '1fr' 
            : images.length === 2 
            ? 'repeat(2, 1fr)' 
            : 'repeat(auto-fill, minmax(200px, 1fr))';
    };

    const getImageHeight = () => {
        if (layout === 'single') return maxHeight;
        return images.length === 1 ? maxHeight : Math.min(maxHeight, 200);
    };

    return (
        <div className={className}>
            {/* Image Grid */}
            <div style={{ 
                display: layout === 'carousel' ? 'flex' : 'grid',
                gridTemplateColumns: getGridColumns(),
                gap: '12px',
                marginBottom: '16px',
                overflowX: layout === 'carousel' ? 'auto' : 'visible'
            }}>
                {images.map((image: string, index: number) => (
                    <Tooltip
                        key={index}
                        title={`Click để xem ${title || 'hình ảnh'} ${index + 1}/${images.length}`}
                        placement="top"
                    >
                        <div 
                            style={{
                                position: 'relative',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: '1px solid var(--color-accent)',
                                backgroundColor: 'var(--color-primary-light)',
                                minWidth: layout === 'carousel' ? '200px' : 'auto',
                                flexShrink: layout === 'carousel' ? 0 : 1
                            }}
                            onClick={() => handleImageClick(index)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Loading overlay */}
                            {imageLoading[index] && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1
                                }}>
                                    <Spin />
                                </div>
                            )}

                            <img 
                                src={image} 
                                alt="Uploaded Image"
                                style={{
                                    width: '100%',
                                    height: getImageHeight(),
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                onLoad={() => {
                                    setImageLoading(prev => ({ ...prev, [index]: false }));
                                }}
                                onLoadStart={() => {
                                    setImageLoading(prev => ({ ...prev, [index]: true }));
                                }}
                                onError={() => {
                                    setImageLoading(prev => ({ ...prev, [index]: false }));
                                }}
                            />
                            
                            {/* Hover overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s ease',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0';
                            }}>
                                <ExpandOutlined style={{ marginRight: '8px' }} />
                                Xem ảnh
                            </div>

                            {/* Image counter */}
                            {showCounter && images.length > 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                }}>
                                    {index + 1}/{images.length}
                                </div>
                            )}
                        </div>
                    </Tooltip>
                ))}
            </div>

            {/* Preview Modal */}
            {previewVisible && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.9)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setPreviewVisible(false);
                    }
                }}>
                    
                    {/* Close button */}
                    <Button
                        type="text"
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            color: 'white',
                            fontSize: '20px',
                            zIndex: 1001
                        }}
                        onClick={() => setPreviewVisible(false)}
                    >
                        ✕
                    </Button>

                    {/* Main image */}
                    <div style={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={images[currentIndex]}
                            alt="Uploaded Image"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                cursor: 'default'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    type="text"
                                    icon={<LeftOutlined />}
                                    style={{
                                        position: 'absolute',
                                        left: '-60px',
                                        color: 'white',
                                        fontSize: '24px',
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        border: 'none',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrev();
                                    }}
                                />
                                
                                <Button
                                    type="text"
                                    icon={<RightOutlined />}
                                    style={{
                                        position: 'absolute',
                                        right: '-60px',
                                        color: 'white',
                                        fontSize: '24px',
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        border: 'none',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                />
                            </>
                        )}
                    </div>

                    {/* Image info */}
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <PictureOutlined />
                        <span>{title || 'Hình ảnh'}</span>
                        {images.length > 1 && (
                            <span>({currentIndex + 1}/{images.length})</span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {showThumbnails && images.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '8px',
                            maxWidth: '80vw',
                            overflowX: 'auto',
                            padding: '8px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '12px'
                        }}>
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: '60px',
                                        height: '40px',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: currentIndex === index 
                                            ? '2px solid var(--color-secondary)' 
                                            : '2px solid transparent',
                                        opacity: currentIndex === index ? 1 : 0.7,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(index);
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt="Uploaded Image"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
