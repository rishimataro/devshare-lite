'use client';

import React, { useState } from 'react';
import { Spin } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: React.ReactNode;
    onLoad?: () => void;
    onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    style = {},
    placeholder,
    onLoad,
    onError
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setLoading(false);
        setError(true);
        onError?.();
    };

    const defaultPlaceholder = (
        <div style={{
            width: width || '100%',
            height: height || '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            border: '1px dashed #d9d9d9',
            borderRadius: '6px',
            color: '#999',
            flexDirection: 'column',
            gap: '8px'
        }}>
            {loading ? (
                <>
                    <Spin size="small" />
                    <span style={{ fontSize: '12px' }}>Đang tải...</span>
                </>
            ) : (
                <>
                    <PictureOutlined style={{ fontSize: '24px' }} />
                    <span style={{ fontSize: '12px' }}>Không thể tải hình ảnh</span>
                </>
            )}
        </div>
    );

    if (error) {
        return placeholder || defaultPlaceholder;
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {loading && (placeholder || defaultPlaceholder)}
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                style={{
                    ...style,
                    display: loading ? 'none' : 'block'
                }}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
            />
        </div>
    );
};

export default OptimizedImage;
