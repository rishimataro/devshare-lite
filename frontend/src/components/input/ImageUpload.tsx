'use client';

import React, { useState } from 'react';
import { Upload, Button, Modal, Image, Spin, Progress, App } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { uploadToCloudinary, validateImageFile } from '../../utils/cloudinary';

interface ImageUploadProps {
    value?: string[];
    onChange?: (urls: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value = [],
    onChange,
    maxImages = 5,
    disabled = false
}) => {
    const { message } = App.useApp();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    React.useEffect(() => {
        const newFileList: UploadFile[] = value.map((url, index) => ({
            uid: `${index}`,
            name: `image-${index}`,
            status: 'done',
            url: url,
            thumbUrl: url,
        }));
        setFileList(newFileList);
    }, [value]);

    const handleUpload = async (file: File) => {
        if (value.length >= maxImages) {
            message.error(`Chỉ có thể upload tối đa ${maxImages} hình ảnh`);
            return false;
        }

        try {
            validateImageFile(file);
        } catch (error: any) {
            message.error(error.message);
            return false;
        }

        setUploading(true);
        setUploadProgress(0);

        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const url = await uploadToCloudinary(file);
            const newUrls = [...value, url];
            onChange?.(newUrls);
            setUploadProgress(100);
            message.success('Upload hình ảnh thành công!');
        } catch (error) {
            message.error('Upload hình ảnh thất bại!');
            setUploadProgress(0);
        } finally {
            clearInterval(progressInterval);
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }

        return false;
    };

    const handleRemove = (file: UploadFile) => {
        const index = fileList.findIndex(item => item.uid === file.uid);
        if (index > -1) {
            const newUrls = [...value];
            newUrls.splice(index, 1);
            onChange?.(newUrls);
        }
    };

    const handlePreview = (file: UploadFile) => {
        setPreviewImage(file.url || file.thumbUrl || '');
        setPreviewTitle(file.name || `Image ${file.uid}`);
        setPreviewVisible(true);
    };

    const uploadButton = (
        <div>
            {uploading ? <Spin /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>
                {uploading ? 'Đang tải lên...' : 'Tải lên'}
            </div>
            {uploading && uploadProgress > 0 && (
                <Progress
                    percent={uploadProgress}
                    size="small"
                    showInfo={false}
                    style={{ width: '80px', marginTop: 4 }}
                />
            )}
        </div>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={handleUpload}
                onRemove={handleRemove}
                onPreview={handlePreview}
                disabled={disabled || uploading}
                accept="image/*"
                multiple
                showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: !disabled,
                    showDownloadIcon: false,
                }}
            >
                {fileList.length >= maxImages ? null : uploadButton}
            </Upload>

            <div style={{ marginTop: 8, fontSize: '12px', color: 'var(--color-text)' }}>
                Hỗ trợ: JPG, PNG, GIF, WebP. Tối đa {maxImages} ảnh, mỗi ảnh không quá 10MB.
            </div>

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

export default ImageUpload;
