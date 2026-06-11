'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const user = auth.getUser();

  useEffect(() => {
    setMounted(true);
    if (!auth.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted || !auth.isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="lg:pl-64 transition-all duration-300">
        <Header title={title} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
