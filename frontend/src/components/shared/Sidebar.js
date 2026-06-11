'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/auth';

const icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  password: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  sellers: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
  orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

const sellerLinks = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: icons.dashboard },
  { href: '/seller/products', label: 'Products', icon: icons.products },
  { href: '/seller/settings', label: 'Settings', icon: icons.settings },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: icons.dashboard },
  { href: '/admin/sellers', label: 'Sellers', icon: icons.sellers },
  { href: '/admin/settings', label: 'Settings', icon: icons.settings },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const user = auth.getUser();
  const isAdmin = user?.role === 'ADMIN';
  const links = isAdmin ? adminLinks : sellerLinks;

  const isActive = (href) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full sidebar-glass transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100/80">
          {!collapsed && (
            <Link href="/" className="sidebar-brand">
              <span className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm text-white ${isAdmin ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-primary-500 to-primary-700'}`}>
                  {isAdmin ? 'A' : 'S'}
                </span>
                {isAdmin ? 'Admin Panel' : 'Seller Panel'}
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm text-white ${isAdmin ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-primary-500 to-primary-700'}`}>
                {isAdmin ? 'A' : 'S'}
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="p-3 space-y-0.5 overflow-y-auto" style={{ height: 'calc(100% - 4rem - 3.5rem)' }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${isActive(link.href) ? 'sidebar-link-active' : 'sidebar-link-inactive'} ${isAdmin && isActive(link.href) ? 'sidebar-link-active-admin' : ''}`}
            >
              <span className={`${isActive(link.href) ? (isAdmin ? 'text-purple-600' : 'text-primary-600') : 'text-gray-400'}`}>
                {link.icon}
              </span>
              {!collapsed && <span>{link.label}</span>}
              {isActive(link.href) && !collapsed && (
                <span className={`ml-auto w-1.5 h-5 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-primary-500'}`} />
              )}
            </Link>
          ))}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100/80 ${collapsed ? 'text-center' : ''}`}>
          <button
            onClick={() => auth.logout()}
            className={`sidebar-link sidebar-link-inactive w-full ${collapsed ? 'justify-center' : ''}`}
          >
            <span className="text-gray-400">{icons.logout}</span>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
