'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboadLayout';
import DashboardHome from '@/components/dashboard/DashboardHome';
import LoadingPage from '@/components/LoadingPage';

const DashboardHomePage: React.FC = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <LoadingPage message="Đang tải trang chủ..." />;
    }

    if (status === 'unauthenticated') {
        redirect('/auth/login');
    }

    return (
        <DashboardLayout>
            <DashboardHome />
        </DashboardLayout>
    );
};

export default DashboardHomePage;