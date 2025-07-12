import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create an authenticated request function
export const makeAuthenticatedRequest = async (config: any) => {
    try {
        // Get session from NextAuth
        const session = await getSession();
        let token = session?.access_token;
        
        // Fallback to localStorage
        if (!token && typeof window !== 'undefined') {
            token = localStorage.getItem('access_token') || undefined;
        }
        
        console.log('Making authenticated request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token,
            sessionExists: !!session,
            username: session?.user?.username
        });
        
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        // Create axios config with auth header
        const authConfig = {
            ...config,
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...config.headers
            }
        };
        
        const response = await axios(authConfig);
        return response;
        
    } catch (error: any) {
        // Log the error for debugging but don't use console.error to avoid stack traces
        console.log('Authenticated request failed:', error?.response?.status || error?.message);
        
        // Handle 401 errors
        if (error.response?.status === 401) {
            console.warn('Authentication failed, clearing tokens');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                // Don't redirect immediately, let the calling component handle it
            }
        }
        
        throw error;
    }
};

// Create a public request function (no auth needed)
export const makePublicRequest = async (config: any) => {
    const publicConfig = {
        ...config,
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...config.headers
        }
    };
    
    return axios(publicConfig);
};
