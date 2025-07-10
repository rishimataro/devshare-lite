'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, Typography } from 'antd';
import DashboardLayout from '@/components/layout/dashboadLayout';
import LoadingPage from '@/components/LoadingPage';

const { Title } = Typography;

const BookmarksPage: React.FC = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <LoadingPage message="Loading bookmarks..." />;
    }

    if (status === 'unauthenticated') {
        redirect('/auth/login');
    }

    return (
        <DashboardLayout>
            <Card>
                <Title level={3}>Bookmarks</Title>
                <p>This page will contain your bookmarked posts. Feature coming soon!</p>
            </Card>
        </DashboardLayout>
    );
};

export default BookmarksPage;