'use client';

import React from 'react';
import { Button, Typography } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

export default function NotFound() {
    const router = useRouter();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            backgroundImage: 'url("/404.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 1
            }}></div>
            
            <div style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                color: 'white',
                maxWidth: '600px',
                padding: '40px'
            }}>
                <img 
                    src="/logo.png" 
                    alt="DevShare Logo" 
                    style={{
                        width: 60,
                        height: 60,
                        objectFit: 'contain',
                        marginBottom: '20px'
                    }}
                />
                
                <Title level={1} style={{ 
                    color: 'white', 
                    fontSize: '4rem', 
                    margin: '0 0 20px 0',
                    fontWeight: 'bold'
                }}>
                    404
                </Title>
                
                <Title level={2} style={{ 
                    color: 'white', 
                    margin: '0 0 16px 0' 
                }}>
                    Trang không tìm thấy
                </Title>
                
                <Paragraph style={{ 
                    color: 'white', 
                    fontSize: '1.1rem', 
                    marginBottom: '30px',
                    opacity: 0.9
                }}>
                    Xin lỗi! Trang mà bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
                </Paragraph>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                        style={{
                            backgroundColor: 'var(--color-secondary)',
                            borderColor: 'var(--color-secondary)'
                        }}
                    >
                        Quay lại
                    </Button>
                    
                    <Button
                        type="primary"
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => router.push('/')}
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            borderColor: 'var(--color-primary)'
                        }}
                    >
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}