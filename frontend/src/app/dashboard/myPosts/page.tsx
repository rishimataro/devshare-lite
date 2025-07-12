'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboadLayout';
import MyPostsList from '@/components/dashboard/MyPostsList';
import LoadingPage from '@/components/LoadingPage';

const MyPostsPage: React.FC = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <LoadingPage message="Đang tải bài viết của bạn..." />;
    }

    if (status === 'unauthenticated') {
        redirect('/auth/login');
    }

    return (
        <DashboardLayout>
            <MyPostsList />
        </DashboardLayout>
    );
};

export default MyPostsPage;