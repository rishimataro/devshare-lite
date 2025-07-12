import axios from 'axios';

// Configuration for Cloudinary
const CLOUDINARY_CLOUD_NAME = '';
const CLOUDINARY_UPLOAD_PRESET = 'devshare'; // Bạn cần thiết lập upload preset trong Cloudinary dashboard

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): void => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP)');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Kích thước file không được vượt quá 10MB');
  }
};

/**
 * Upload image to Cloudinary
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Validate file before upload
    validateImageFile(file);

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    // Upload to Cloudinary - theo yêu cầu của bạn
    const response = await axios.post('https://api.cloudinary.com/v1_1/de6cc8adv/image/upload', formData);
    const imageUrl = (response.data as any).secure_url;
    
    if (!imageUrl) {
      throw new Error('Không nhận được URL ảnh từ Cloudinary');
    }

    return imageUrl;
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(`Upload failed: ${error.response.data?.error?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: Unable to connect to Cloudinary');
    } else {
      // Something else happened
      throw new Error(`Upload error: ${error.message}`);
    }
  }
};

/**
 * Delete image from Cloudinary (optional)
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    // Note: This requires server-side implementation as it needs API secret
    // For client-side, you might want to call your backend API instead
    console.warn('Delete from Cloudinary should be implemented on server-side');
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicId = (url: string): string => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};
