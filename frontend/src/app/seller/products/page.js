'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import Modal from '@/components/shared/Modal';
import api from '@/lib/api';
import { formatCurrency, getStatusBadgeClass, truncate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', sellingPrice: '', mrp: '', stock: '', category: '', description: '', delivery: 'Free Delivery',
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [flipkartUrl, setFlipkartUrl] = useState('');
  const [importing, setImporting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/products?page=${page}&limit=10`);
      setProducts(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const resetForm = () => {
    setForm({ name: '', sellingPrice: '', mrp: '', stock: '', category: '', description: '', delivery: 'Free Delivery' });
    setImages([]);
    setEditProduct(null);
    setFlipkartUrl('');
  };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      sellingPrice: product.sellingPrice.toString(),
      mrp: product.mrp.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: product.description,
      delivery: product.delivery,
    });
    setImages(product.images || []);
    setShowModal(true);
  };

  const MAX_IMAGES = 5;

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      const filesToUpload = Array.from(files).slice(0, remaining);
      for (const file of filesToUpload) {
        formData.append('images', file);
      }
      const data = await api.upload('/products/upload-images', formData);
      setImages(prev => [...prev, ...data.data]);
      toast.success('Images uploaded');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImportFlipkart = async () => {
    if (!flipkartUrl.includes('flipkart.com')) {
      toast.error('Enter a valid Flipkart product URL');
      return;
    }
    setImporting(true);
    try {
      const data = await api.post('/products/import-flipkart', { url: flipkartUrl });
      const p = data.data;
      setForm({
        name: p.name || '',
        sellingPrice: p.sellingPrice?.toString() || '',
        mrp: p.mrp?.toString() || '',
        stock: p.stock?.toString() || '10',
        category: p.category || '',
        description: p.description || '',
        delivery: p.delivery || 'Free Delivery',
      });
      if (p.images?.length) setImages(p.images);
      toast.success('Product details fetched!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        sellingPrice: parseFloat(form.sellingPrice),
        mrp: parseFloat(form.mrp),
        stock: parseInt(form.stock),
        images,
      };

      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }

      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    {
      header: 'Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0] ? (
            <img src={row.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover bg-gray-100 ring-1 ring-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium">N/A</div>
          )}
          <span className="font-semibold text-gray-900">{truncate(row.name, 35)}</span>
        </div>
      ),
    },
    { header: 'Price', render: (row) => <span className="font-semibold text-gray-900">{formatCurrency(row.sellingPrice)}</span> },
    { header: 'MRP', render: (row) => <span className="text-gray-400 line-through text-xs">{formatCurrency(row.mrp)}</span> },
    { header: 'Stock', render: (row) => <span className={`font-medium ${row.stock <= 5 ? 'text-red-600' : 'text-gray-700'}`}>{row.stock}</span> },
    { header: 'Category', render: (row) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">{row.category || '—'}</span> },
    { header: 'Status', render: (row) => <span className={getStatusBadgeClass(row.status)}>{row.status}</span> },
    {
      header: 'Actions', render: (row) => (
        <div className="flex gap-1.5">
          <button onClick={() => openEdit(row)} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Products">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 font-medium">{products.length} products</p>
          <button onClick={openCreate} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Product
          </button>
        </div>

        <DataTable columns={columns} data={products} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage} emptyMessage="No products yet. Add your first product!" />

        <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editProduct ? 'Edit Product' : 'Add Product'} size="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!editProduct && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                <label className="font-semibold text-sm text-blue-800 flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Import from Flipkart
                </label>
                <div className="flex gap-2">
                  <input className="input flex-1 bg-white" placeholder="https://www.flipkart.com/..." value={flipkartUrl}
                    onChange={(e) => setFlipkartUrl(e.target.value)} />
                  <button type="button" onClick={handleImportFlipkart} disabled={importing}
                    className="btn-primary whitespace-nowrap">
                    {importing ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Fetching...
                      </span>
                    ) : 'Fetch'}
                  </button>
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="label">Product Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="label">Selling Price (₹)</label>
                <input type="number" step="0.01" className="input" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="label">MRP (₹)</label>
                <input type="number" step="0.01" className="input" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="label">Stock</label>
                <input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="label">Category</label>
                <input className="input" placeholder="e.g. Electronics" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
            <div className="input-group">
              <label className="label">Delivery Info</label>
              <input className="input" value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="label">Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="input-group">
              <label className="label">Product Images (max {MAX_IMAGES})</label>
              <div className="grid grid-cols-5 gap-3 mb-3">
                {Array.from({ length: MAX_IMAGES }).map((_, idx) => (
                  images[idx] ? (
                    <div key={idx} className="relative group aspect-square">
                      <img src={images[idx]} alt="" className="w-full h-full rounded-xl object-cover border border-gray-200 shadow-sm" />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <button type="button" key={idx} onClick={triggerUpload}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50/30 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      <span className="text-[10px] text-gray-400 font-medium">Add</span>
                    </button>
                  )
                ))}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              {uploading && <p className="text-xs text-primary-600 font-medium mt-1 flex items-center gap-1">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Uploading...
              </p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1">
                {editProduct ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Update
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create
                  </span>
                )}
              </button>
              <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
