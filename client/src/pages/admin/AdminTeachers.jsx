import { useEffect, useState } from 'react';
import api from '../../services/api';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';

const emptyForm = {
  name: '',
  subject: '',
  bio: '',
  photo: '',
  order: 0,
  status: 'active',
};

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchTeachers = () => api.get('/teachers').then((res) => setTeachers(res.data.data));

  useEffect(() => {
    fetchTeachers()
      .catch(() => setAlert({ type: 'error', message: 'Failed to load teachers' }))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (teacher) => {
    setEditId(teacher._id);
    setForm({
      name: teacher.name || '',
      subject: teacher.subject || '',
      bio: teacher.bio || '',
      photo: teacher.photo || '',
      order: teacher.order ?? 0,
      status: teacher.status || 'active',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0 };

    try {
      if (editId) {
        await api.put(`/teachers/${editId}`, payload);
        setAlert({ type: 'success', message: 'Teacher updated successfully' });
      } else {
        await api.post('/teachers', payload);
        setAlert({ type: 'success', message: 'Teacher added successfully' });
      }
      setModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to save teacher' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this teacher?')) return;

    try {
      await api.delete(`/teachers/${id}`);
      setAlert({ type: 'success', message: 'Teacher deleted successfully' });
      fetchTeachers();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to delete teacher' });
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="page-title">Teacher Management</h1>
          <p className="text-sm text-gray-500 mt-1">Add, edit, publish, or remove teacher profiles shown on the public website.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Teacher</button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {teachers.length === 0 ? (
        <EmptyState title="No teachers found" message="Add your first teacher profile to show it on the Teachers page." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="card">
              <div className="flex items-start gap-4">
                <img
                  src={teacher.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=1e40af&color=fff&size=96`}
                  alt={teacher.name}
                  className="h-20 w-20 rounded-lg object-cover bg-gray-100 border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=1e40af&color=fff&size=96`;
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 truncate">{teacher.name}</h3>
                      <p className="text-sm text-primary-700 font-medium">{teacher.subject}</p>
                    </div>
                    <StatusBadge status={teacher.status} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{teacher.bio || 'No bio added yet.'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Display order: {teacher.order ?? 0}</span>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(teacher)} className="text-sm text-primary-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(teacher._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Teacher' : 'Add Teacher'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Teacher Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium">Photo URL</label>
              <input
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                placeholder="/images/teacher-1.png"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Display Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Short Bio</label>
            <textarea rows="4" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">{editId ? 'Update Teacher' : 'Add Teacher'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTeachers;
