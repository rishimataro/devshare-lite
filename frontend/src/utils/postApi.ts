import axios from 'axios';
import { getSession } from 'next-auth/react';
import { makeAuthenticatedRequest, makePublicRequest } from './authApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface CreatePostData {
    title: string;
    content: string;
    tags?: string[];
    images?: string[];
    status?: 'draft' | 'published' | 'archived';
}

interface UpdatePostData {
    title?: string;
    content?: string;
    tags?: string[];
    images?: string[];
    status?: 'draft' | 'published' | 'archived';
}

export const getPosts = async () => {
    const res = await makePublicRequest({
        method: 'GET',
        url: '/posts'
    });
    return (res.data as any).data;
};

export const createPost = async (postData: CreatePostData) => {
    console.log('Creating post with data:', postData);
    
    const res = await makeAuthenticatedRequest({
        method: 'POST',
        url: '/posts',
        data: postData
    });
    
    console.log('Create post response:', res.data);
    return res.data;
};

export const likePost = async (postId: string) => {
    console.log('Liking post:', postId);
    
    const res = await makeAuthenticatedRequest({
        method: 'POST',
        url: `/posts/${postId}/like`
    });
    
    return res.data;
};

export const getPostById = async (postId: string) => {
    const res = await makePublicRequest({
        method: 'GET',
        url: `/posts/${postId}`
    });
    return res.data;
};

export const getPostByIdForOwner = async (postId: string) => {
    const res = await makeAuthenticatedRequest({
        method: 'GET',
        url: `/posts/${postId}/owner`
    });
    return res.data;
};

export const updatePost = async (postId: string, postData: UpdatePostData) => {
    const res = await makeAuthenticatedRequest({
        method: 'PATCH',
        url: `/posts/${postId}`,
        data: postData
    });
    return res.data;
};

export const deletePost = async (postId: string) => {
    const res = await makeAuthenticatedRequest({
        method: 'DELETE',
        url: `/posts/${postId}`
    });
    return res.data;
};

export const getMyPosts = async () => {
    const res = await makeAuthenticatedRequest({
        method: 'GET',
        url: '/posts/me'
    });
    return res.data;
};

export const getPostImages = async (postId: string) => {
    const post = await getPostById(postId);
    return (post as any)?.images || [];
};

export const getPostImagesForOwner = async (postId: string) => {
    const post = await getPostByIdForOwner(postId);
    return (post as any)?.images || [];
};
