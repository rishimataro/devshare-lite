'use client';

import React, { useState } from 'react';
import { Image, Modal, Row, Col } from 'antd';

interface PostImagesProps {
  images: string[];
  maxDisplay?: number;
}

const PostImages: React.FC<PostImagesProps> = ({ images, maxDisplay = 4 }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  if (!images || images.length === 0) {
    return null;
  }

  const handlePreview = (image: string, index: number) => {
    setPreviewImage(image);
    setPreviewTitle(`Hình ảnh ${index + 1}`);
    setPreviewVisible(true);
  };

  const displayImages = images.slice(0, maxDisplay);
  const remainingCount = images.length - maxDisplay;

  const getGridSpan = (totalImages: number, index: number) => {
    if (totalImages === 1) return 24;
    if (totalImages === 2) return 12;
    if (totalImages === 3) {
      return index === 0 ? 24 : 12;
    }
    return 12;
  };

  const getImageHeight = (totalImages: number, index: number) => {
    if (totalImages === 1) return 'auto';
    if (totalImages === 2) return '250px';
    if (totalImages === 3) {
      return index === 0 ? '200px' : '150px';
    }
    return '200px';
  };

  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
        {displayImages.map((image, index) => (
          <Col 
            key={index} 
            span={getGridSpan(displayImages.length, index)}
          >
            <div 
              style={{ 
                position: 'relative', 
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 8,
                border: '1px solid #f0f0f0'
              }}
              onClick={() => handlePreview(image, index)}
            >
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                style={{ 
                  width: '100%', 
                  height: getImageHeight(displayImages.length, index),
                  objectFit: 'cover'
                }}
                preview={false}
              />
              {index === maxDisplay - 1 && remainingCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}
                >
                  +{remainingCount} ảnh khác
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        centered
      >
        <Image
          alt="preview"
          style={{ width: '100%' }}
          src={previewImage}
          preview={false}
        />
      </Modal>
    </>
  );
};

export default PostImages;
