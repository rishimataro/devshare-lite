'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboadLayout';
import EditPostForm from '@/components/dashboard/EditPostForm';
import LoadingPage from '@/components/LoadingPage';

const EditPostPage: React.FC = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <LoadingPage message="Đang tải trình chỉnh sửa..." />;
    }

    if (status === 'unauthenticated') {
        redirect('/auth/login');
    }

    return (
        <DashboardLayout>
            <EditPostForm />
        </DashboardLayout>
    );
};

export default EditPostPage;
