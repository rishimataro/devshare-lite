import queryString from 'query-string';
import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with auth interceptor
const createAuthenticatedAxiosInstance = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor to add auth token
    instance.interceptors.request.use(
        async (config: any) => {
            try {
                // Get session from NextAuth
                const session = await getSession();
                let token = session?.access_token;
                
                // Fallback to localStorage
                if (!token && typeof window !== 'undefined') {
                    token = localStorage.getItem('access_token') || undefined;
                }
                
                if (token) {
                    if (!config.headers) {
                        config.headers = {};
                    }
                    config.headers.Authorization = `Bearer ${token}`;
                }
                
                return config;
            } catch (error) {
                console.error('Error adding auth token:', error);
                return config;
            }
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor to handle errors
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Handle unauthorized
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// Export authenticated axios instance
export const api = createAuthenticatedAxiosInstance();

export const sendRequest = async <T>(props: IRequest) => { //type
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

export const sendRequestFile = async <T>(props: IRequest) => { //type
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ ...headers }),
        body: body ? body : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T; //generic
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};
