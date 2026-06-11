import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { NOTICE_TARGETS } from '../../utils/constants';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', targetType: 'all', batchId: '', status: 'published' });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetch = () => api.get('/notices').then((r) => setNotices(r.data.data));
  useEffect(() => { Promise.all([fetch(), api.get('/batches')]).then(([, b]) => setBatches(b.data.data)).finally(() => setLoading(false)); }, []);

  const openCreate = () => { setEditId(null); setForm({ title: '', description: '', targetType: 'all', batchId: '', status: 'published' }); setModalOpen(true); };
  const openEdit = (n) => { setEditId(n._id); setForm({ title: n.title, description: n.description, targetType: n.targetType, batchId: n.batchId?._id || '', status: n.status }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, batchId: form.targetType === 'batch' ? form.batchId : null };
    try {
      if (editId) await api.put(`/notices/${editId}`, data);
      else await api.post('/notices', data);
      setAlert({ type: 'success', message: editId ? 'Updated' : 'Created' });
      setModalOpen(false);
      fetch();
    } catch (err) { setAlert({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete notice?')) return;
    await api.delete(`/notices/${id}`);
    fetch();
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Notice Management</h1>
        <button onClick={openCreate} className="btn-primary">+ Create Notice</button>
      </div>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n._id} className="card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{n.title}</h3>
              <div className="flex gap-2"><StatusBadge status={n.status} /><span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">{n.targetType}</span></div>
            </div>
            <p className="text-gray-600 text-sm mb-3">{n.description}</p>
            <div className="flex gap-3 text-sm">
              <button onClick={() => openEdit(n)} className="text-primary-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(n._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Notice' : 'Create Notice'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-sm font-medium">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" /></div>
          <div><label className="text-sm font-medium">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="input-field" /></div>
          <div><label className="text-sm font-medium">Target</label><select value={form.targetType} onChange={(e) => setForm({ ...form, targetType: e.target.value })} className="input-field">{NOTICE_TARGETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
          {form.targetType === 'batch' && <div><label className="text-sm font-medium">Batch</label><select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required className="input-field"><option value="">Select</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>}
          <div><label className="text-sm font-medium">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field"><option value="published">Published</option><option value="draft">Draft</option></select></div>
          <button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminNotices;
