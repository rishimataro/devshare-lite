'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, Typography } from 'antd';
import DashboardLayout from '@/components/layout/dashboadLayout';
import LoadingPage from '@/components/LoadingPage';

const { Title } = Typography;

const VotePostsPage: React.FC = () => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <LoadingPage message="Loading vote posts..." />;
    }

    if (status === 'unauthenticated') {
        redirect('/auth/login');
    }

    return (
        <DashboardLayout>
            <Card>
                <Title level={3}>Vote Posts</Title>
                <p>This page will contain posts where users can vote. Feature coming soon!</p>
            </Card>
        </DashboardLayout>
    );
};

export default VotePostsPage;