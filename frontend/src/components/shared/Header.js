'use client';

import { useState, useRef, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { getInitials } from '@/lib/utils';

export default function Header({ title, toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = auth.getUser();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`header-avatar ${isAdmin ? 'header-avatar-admin' : ''}`}>
                {getInitials(user?.storeName || user?.username)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700">{user?.storeName || user?.username}</p>
                <p className={`header-role-badge ${isAdmin ? 'header-role-badge-admin' : ''}`}>{user?.role?.toLowerCase()}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.storeName || user?.username}</p>
                  {isAdmin && (
                    <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { auth.logout(); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
