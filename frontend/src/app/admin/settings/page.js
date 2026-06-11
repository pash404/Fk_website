'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ upi_id: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/settings').then((res) => {
      setSettings(res.data || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return (
    <DashboardLayout title="Settings">
      <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-purple-500" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Platform Settings">
      <div className="max-w-lg">
        <div className="card">
          <div className="card-header"><h3 className="font-semibold">General Settings</h3></div>
          <div className="card-body">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="input-group">
                <label className="label">Default UPI ID</label>
                <input className="input" placeholder="admin@upi" value={settings.upi_id || ''} onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })} />
                <p className="text-xs text-gray-400 mt-1">This UPI ID is used for public checkouts</p>
              </div>
              <button type="submit" className="btn-primary">Save Settings</button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
