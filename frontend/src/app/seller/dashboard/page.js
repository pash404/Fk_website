'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import StatsCard from '@/components/shared/StatsCard';
import api from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { auth } from '@/lib/auth';

function GreetingBanner({ sellerName, subDays, subActive }) {
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 17) greeting = 'Good Afternoon';

  let tier = 'Gold';
  let tierColor = 'from-amber-500 to-yellow-500';
  let tierShadow = 'shadow-amber-500/30';
  if (subDays === null || subDays > 60) {
    tier = 'Platinum Elite';
    tierColor = 'from-purple-600 to-pink-500';
    tierShadow = 'shadow-purple-500/30';
  } else if (subDays > 30) {
    tier = 'Elite';
    tierColor = 'from-blue-600 to-cyan-500';
    tierShadow = 'shadow-blue-500/30';
  } else if (subDays > 7) {
    tier = 'Gold';
    tierColor = 'from-amber-500 to-yellow-500';
    tierShadow = 'shadow-amber-500/30';
  } else {
    tier = 'Silver';
    tierColor = 'from-gray-400 to-gray-300';
    tierShadow = 'shadow-gray-400/30';
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 animate-in">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary-500/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl" />
        {[...Array(6)].map((_, i) => (
          <div key={i}
            className="absolute w-1 h-1 rounded-full bg-white/40 animate-ping"
            style={{
              top: `${15 + i * 14}%`,
              left: `${10 + i * 16}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: '2s',
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300/60 animate-ping"
            style={{
              top: `${8 + i * 22}%`,
              right: `${12 + i * 18}%`,
              animationDelay: `${i * 0.6 + 0.3}s`,
              animationDuration: '2.5s',
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{greeting === 'Good Morning' ? '🌅' : greeting === 'Good Afternoon' ? '☀️' : '🌙'}</span>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {greeting}, {sellerName}!
              </p>
            </div>
            <p className="text-gray-400 text-sm">Welcome to your dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${tierColor} text-white text-sm font-bold shadow-lg ${tierShadow} animate-in animate-in-delay-1`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              {tier} Member
            </div>

            {subDays !== null && (
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-center">
                <p className="text-2xl font-extrabold text-white">{subDays}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Days Left</p>
              </div>
            )}
            {subDays === null && (
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-center">
                <p className="text-lg font-extrabold text-emerald-400">∞</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Unlimited</p>
              </div>
            )}
          </div>
        </div>

        {!subActive && (
          <div className="mt-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            Your subscription has expired. Please renew to continue using all features.
          </div>
        )}
      </div>
    </div>
  );
}

function SparkleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <div key={i}
          className="absolute w-1 h-1 bg-primary-400/30 rounded-full animate-ping"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <div key={i}
          className="absolute w-2 h-2 bg-yellow-300/20 rounded-full animate-ping"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get('/seller/dashboard');
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const user = auth.getUser();
  const sellerName = user?.storeName || user?.username || 'Seller';
  const sub = stats?.subscription;
  const subDays = sub?.daysRemaining ?? null;
  const subActive = sub?.active ?? true;

  return (
    <DashboardLayout title="Dashboard">
      <SparkleBackground />
      <div className="space-y-6 relative z-10">
        <GreetingBanner sellerName={sellerName} subDays={subDays} subActive={subActive} />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="h-4 w-24 bg-gray-100 rounded-lg shimmer" />
                      <div className="h-8 w-32 bg-gray-100 rounded-lg shimmer" />
                      <div className="h-3 w-20 bg-gray-100 rounded-lg shimmer" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="animate-in">
                <StatsCard title="Total Products" value={stats?.totalProducts ?? '—'} icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                } color="blue" />
              </div>
              <div className="animate-in animate-in-delay-1">
                <StatsCard
                  title="Subscription"
                  value={subActive ? 'Active' : 'Expired'}
                  icon={subActive
                    ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  }
                  color={subActive ? 'teal' : 'red'}
                  subtitle={subDays !== null ? `${subDays} days remaining` : 'Unlimited'}
                />
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card animate-in animate-in-delay-2">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              </div>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl shimmer" />)}
                </div>
              ) : stats?.recentActivities?.length > 0 ? (
                <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto scrollbar-hide">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                          {activity.action.replace(/_/g, ' ').toLowerCase()}
                        </p>
                        {activity.details && (
                          <p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {formatDateTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <p className="text-gray-500 font-medium">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
