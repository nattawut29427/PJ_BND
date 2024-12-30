// pages/dashboard.tsx
'use client';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>You need to log in!</div>;
  }

  return <div>Welcome to the dashboard, {session?.user?.name}!</div>;
};

export default Dashboard;
