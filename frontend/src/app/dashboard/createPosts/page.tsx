'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboadLayout';
import PostForm from '@/components/dashboard/PostForm';
import LoadingPage from '@/components/LoadingPage';

const CreatePostsPage: React.FC = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <LoadingPage message="Loading editor..." />;
    }

    if (status === 'unauthenticated') {
        redirect('/auth/login');
    }

    return (
        <DashboardLayout>
            <PostForm />
        </DashboardLayout>
    );
};

export default CreatePostsPage;