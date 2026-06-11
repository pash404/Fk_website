'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" id="statsGrid">
          <div className="stat-card">
            <div className="stat-icon bg-purple-100 text-purple-600 mb-4">👥</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalSellers || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Total Sellers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-blue-100 text-blue-600 mb-4">📦</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Total Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-amber-100 text-amber-600 mb-4">📋</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</div>
            <div className="text-sm text-gray-500 mt-1">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon bg-emerald-100 text-emerald-600 mb-4">💰</div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <div className="text-sm text-gray-500 mt-1">Total Revenue</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
