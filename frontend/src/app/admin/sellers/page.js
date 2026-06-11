'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSeller, setEditSeller] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', storeName: '', expiresAt: '' });
  const [showPassword, setShowPassword] = useState(false);

  const loadSellers = async () => {
    try {
      const res = await api.get('/admin/sellers');
      setSellers(res.data);
    } catch (e) {
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSellers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/sellers', form);
      toast.success('Seller created');
      setShowModal(false);
      setForm({ username: '', password: '', storeName: '', expiresAt: '' });
      loadSellers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openEdit = (seller) => {
    setEditSeller(seller);
    setForm({
      username: seller.username,
      password: '',
      storeName: seller.storeName || '',
      expiresAt: seller.expiresAt ? new Date(seller.expiresAt).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = { storeName: form.storeName };
      if (form.password) payload.password = form.password;
      if (form.expiresAt) payload.expiresAt = form.expiresAt;
      await api.put(`/admin/sellers/${editSeller.id}`, payload);
      toast.success('Seller updated');
      setShowModal(false);
      setEditSeller(null);
      setForm({ username: '', password: '', storeName: '', expiresAt: '' });
      loadSellers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = editSeller ? handleEdit : handleCreate;

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/sellers/${id}/toggle-status`);
      loadSellers();
    } catch { toast.error('Failed to toggle status'); }
  };

  const deleteSeller = async (id) => {
    if (!confirm('Delete this seller and all their data?')) return;
    try {
      await api.delete(`/admin/sellers/${id}`);
      toast.success('Seller deleted');
      loadSellers();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <DashboardLayout title="Manage Sellers">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">{sellers.length} seller{sellers.length !== 1 ? 's' : ''}</p>
        <button onClick={() => { setEditSeller(null); setForm({ username: '', password: '', storeName: '', expiresAt: '' }); setShowModal(true); }} className="btn-primary">+ Add Seller</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-purple-500" /></div>
      ) : (
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Store</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 text-sm">
                  <td className="px-6 py-4 font-medium">{s.username}</td>
                  <td className="px-6 py-4 text-gray-500">{s.storeName}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(s)} className="btn btn-sm btn-primary">Edit</button>
                    <button onClick={() => toggleStatus(s.id)} className="btn btn-sm btn-secondary">
                      {s.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => deleteSeller(s.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">{editSeller ? 'Edit Seller' : 'Create Seller'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="input" placeholder="Username" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required={!editSeller} disabled={!!editSeller} />
              <div className="relative">
                <input className="input w-full pr-10" placeholder={editSeller ? 'New Password (leave blank to keep)' : 'Password'}
                  type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editSeller} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1" tabIndex={-1}>
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <input className="input" placeholder="Store Name" value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
              <input className="input" placeholder="Expiry Date (optional)" type="date" value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editSeller ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditSeller(null); setForm({ username: '', password: '', storeName: '', expiresAt: '' }); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
