import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { MATERIAL_TYPES } from '../../utils/constants';

const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'pdf', subject: '', batchId: '', url: '', description: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetch = () => api.get('/materials').then((r) => setMaterials(r.data.data));
  useEffect(() => { Promise.all([fetch(), api.get('/batches')]).then(([, b]) => setBatches(b.data.data)).finally(() => setLoading(false)); }, []);

  const openCreate = () => { setEditId(null); setForm({ title: '', type: 'pdf', subject: '', batchId: '', url: '', description: '' }); setModalOpen(true); };
  const openEdit = (m) => { setEditId(m._id); setForm({ title: m.title, type: m.type, subject: m.subject, batchId: m.batchId?._id || '', url: m.url, description: m.description }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/materials/${editId}`, form);
      else await api.post('/materials', form);
      setAlert({ type: 'success', message: editId ? 'Updated' : 'Added' });
      setModalOpen(false);
      fetch();
    } catch (err) { setAlert({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/materials/${id}`); fetch(); };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Study Materials</h1>
        <button onClick={openCreate} className="btn-primary">+ Add Material</button>
      </div>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((m) => (
          <div key={m._id} className="card">
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded capitalize">{m.type.replace('_', ' ')}</span>
            <h3 className="font-bold mt-2">{m.title}</h3>
            <p className="text-sm text-gray-500">{m.batchId?.name} • {m.subject}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{m.description}</p>
            <div className="flex gap-2 mt-3 text-sm">
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Open Link</a>
              <button onClick={() => openEdit(m)} className="text-primary-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(m._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Material' : 'Add Material'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-sm font-medium">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-field" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">{MATERIAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
            <div><label className="text-sm font-medium">Subject</label><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="input-field" /></div>
          </div>
          <div><label className="text-sm font-medium">Batch</label><select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required className="input-field"><option value="">Select</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
          <div><label className="text-sm font-medium">External URL</label><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required placeholder="YouTube, Google Drive, etc." className="input-field" /></div>
          <div><label className="text-sm font-medium">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} /></div>
          <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMaterials;
