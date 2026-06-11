'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SellerSettings() {
  const [form, setForm] = useState({ upiId: '', trId: '' });
  const [loading, setLoading] = useState(true);
  const [upiList, setUpiList] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get('/seller/settings');
        setUpiList(data.data.upiDetails || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addUpi = async () => {
    if (!form.upiId.trim()) return;
    try {
      await api.put('/seller/settings', { upiId: form.upiId.trim(), trId: form.trId.trim() });
      toast.success('UPI ID added');
      setForm({ upiId: '', trId: '' });
      const data = await api.get('/seller/settings');
      setUpiList(data.data.upiDetails || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteUpi = async (id) => {
    try {
      await api.delete(`/seller/upi/${id}`);
      setUpiList(prev => prev.filter(u => u.id !== id));
      toast.success('UPI ID removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        <div className="card animate-in">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">UPI Payment IDs</h2>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="space-y-3">
                <div className="h-14 bg-gray-100 rounded-xl shimmer" />
                <div className="h-10 bg-gray-100 rounded-xl shimmer" />
              </div>
            ) : (
              <div className="space-y-5">
                {upiList.length > 0 && (
                  <div className="space-y-2">
                    {upiList.map((upi) => (
                      <div key={upi.id} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 px-4 py-3 group hover:border-gray-200 transition-all">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            <span className="text-sm font-semibold text-gray-800">{upi.upiId}</span>
                          </div>
                          {upi.trId && (
                            <span className="text-xs text-gray-400 ml-6 mt-0.5 font-medium">TR: {upi.trId}</span>
                          )}
                        </div>
                        <button onClick={() => deleteUpi(upi.id)}
                          className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100 p-5 space-y-3">
                  <div className="input-group">
                    <label className="label text-blue-700">UPI ID</label>
                    <input className="input bg-white" placeholder="you@upi" value={form.upiId}
                      onChange={(e) => setForm({ ...form, upiId: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="label text-blue-700">TR ID <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input className="input bg-white" placeholder="Transaction reference ID" value={form.trId}
                      onChange={(e) => setForm({ ...form, trId: e.target.value })} />
                  </div>
                  <button type="button" onClick={addUpi}
                    className="btn-primary w-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add UPI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
