import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const emptyForm = { name: '', email: '', password: '', phone: '', guardianPhone: '', classLevel: '', schoolCollege: '', address: '', batchId: '', status: 'active' };

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchStudents = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filterBatch) params.append('batchId', filterBatch);
    if (filterStatus) params.append('status', filterStatus);
    api.get(`/students?${params}`).then((r) => setStudents(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    Promise.all([api.get('/batches'), api.get('/students')]).then(([b, s]) => {
      setBatches(b.data.data);
      setStudents(s.data.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (!loading) fetchStudents(); }, [search, filterBatch, filterStatus]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s) => {
    setEditId(s._id);
    setForm({ name: s.name, email: '', password: '', phone: s.phone, guardianPhone: s.guardianPhone, classLevel: s.classLevel, schoolCollege: s.schoolCollege, address: s.address, batchId: s.batchId?._id || '', status: s.status });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const data = { ...form };
        if (!data.password) delete data.password;
        if (!data.email) delete data.email;
        await api.put(`/students/${editId}`, data);
        setAlert({ type: 'success', message: 'Student updated' });
      } else {
        await api.post('/students', form);
        setAlert({ type: 'success', message: 'Student created' });
      }
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      setAlert({ type: 'success', message: 'Student deleted' });
      fetchStudents();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Delete failed' });
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="page-title">Student Management</h1>
        <button onClick={openCreate} className="btn-primary">+ Add Student</button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="card mb-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <input placeholder="Search name, ID, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" />
          <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)} className="input-field">
            <option value="">All Batches</option>
            {batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState title="No students found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Class</th>
                <th className="pb-3 pr-4">Batch</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs">{s.studentId}</td>
                  <td className="py-3 pr-4 font-medium">{s.name}</td>
                  <td className="py-3 pr-4">{s.classLevel}</td>
                  <td className="py-3 pr-4">{s.batchId?.name || '-'}</td>
                  <td className="py-3 pr-4">{s.phone}</td>
                  <td className="py-3 pr-4"><StatusBadge status={s.status} /></td>
                  <td className="py-3 space-x-2">
                    <button onClick={() => openEdit(s)} className="text-primary-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" /></div>
            <div><label className="text-sm font-medium">Email {editId ? '' : '*'}</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required={!editId} className="input-field" placeholder={editId ? 'Leave blank to keep' : ''} /></div>
            <div><label className="text-sm font-medium">Password {editId ? '(optional)' : '*'}</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editId} className="input-field" /></div>
            <div><label className="text-sm font-medium">Phone *</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="input-field" /></div>
            <div><label className="text-sm font-medium">Guardian Phone *</label><input value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} required className="input-field" /></div>
            <div><label className="text-sm font-medium">Class *</label><input value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} required className="input-field" /></div>
            <div><label className="text-sm font-medium">School/College</label><input value={form.schoolCollege} onChange={(e) => setForm({ ...form, schoolCollege: e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium">Batch</label><select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} className="input-field"><option value="">None</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
            <div><label className="text-sm font-medium">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div><label className="text-sm font-medium">Address</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" rows={2} /></div>
          <div className="flex gap-3 pt-2"><button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStudents;
