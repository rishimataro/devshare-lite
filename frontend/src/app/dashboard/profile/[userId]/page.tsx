'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import UserProfile from '../../../../components/dashboard/UserProfile';

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const userId = params.userId as string;

  return <UserProfile userId={userId} />;
};

export default UserProfilePage;
