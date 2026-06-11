'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/shared/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function AdminSellerDetailPage() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ storeName: '', upiId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    api.get(`/admin/sellers/${id}`).then((res) => {
      setSeller(res.data);
      setForm({ storeName: res.data.storeName || '', upiId: res.data.upiId || '', password: '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    try {
      await api.put(`/admin/sellers/${id}`, payload);
      toast.success('Seller updated');
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return (
    <DashboardLayout title="Seller Details">
      <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-purple-500" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title={`Seller: ${seller?.username}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header"><h3 className="font-semibold">Edit Seller</h3></div>
            <div className="card-body">
              <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
                <div className="input-group">
                  <label className="label">Store Name</label>
                  <input className="input" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="label">UPI ID</label>
                  <input className="input" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} />
                </div>
                <div className="input-group">
                  <label className="label">New Password (leave blank to keep)</label>
                  <div className="relative">
                    <input className="input w-full pr-10" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1" tabIndex={-1}>
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
        <div className="card h-fit">
          <div className="card-header"><h3 className="font-semibold">Info</h3></div>
          <div className="card-body space-y-3 text-sm">
            <div><span className="text-gray-500">Username:</span> <span className="font-medium">{seller?.username}</span></div>
            <div><span className="text-gray-500">Role:</span> <span className="font-medium capitalize">{seller?.role?.toLowerCase()}</span></div>
            <div><span className="text-gray-500">Status:</span> <span className={`badge ${seller?.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{seller?.status}</span></div>
            <div><span className="text-gray-500">Created:</span> <span className="font-medium">{seller?.createdAt ? formatDate(seller.createdAt) : '-'}</span></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
