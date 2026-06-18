import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { formatCurrency, formatDate, paymentMethodLabel } from '../../utils/constants';

const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', paymentStatus: '', batchId: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchAdmissions = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return api.get(`/admissions?${params.toString()}`).then((res) => setAdmissions(res.data.data));
  };

  useEffect(() => {
    Promise.all([
      fetchAdmissions(),
      api.get('/batches').then((res) => setBatches(res.data.data)),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmissions().catch(() => setAlert({ type: 'error', message: 'Failed to load admission requests' }));
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const approve = async (id) => {
    try {
      await api.patch(`/admissions/${id}/approve`);
      setAlert({ type: 'success', message: 'Admission approved and student linked' });
      fetchAdmissions();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Approval failed' });
    }
  };

  const reject = async (id) => {
    const rejectedReason = prompt('Reason for rejection?') || '';
    try {
      await api.patch(`/admissions/${id}/reject`, { rejectedReason });
      setAlert({ type: 'success', message: 'Admission rejected' });
      fetchAdmissions();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Rejection failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this admission request?')) return;
    await api.delete(`/admissions/${id}`);
    fetchAdmissions();
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Admission Requests</h1>
      </div>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="card mb-5">
        <div className="grid md:grid-cols-4 gap-3">
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input-field"
            placeholder="Search name, phone, transaction, course, batch"
          />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input-field">
            <option value="">All admission statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={filters.paymentStatus} onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })} className="input-field">
            <option value="">All payment statuses</option>
            <option value="not_paid">Not Paid</option>
            <option value="payment_submitted">Payment Submitted</option>
            <option value="paid">Paid</option>
            <option value="due">Due</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={filters.batchId} onChange={(e) => setFilters({ ...filters, batchId: e.target.value })} className="input-field">
            <option value="">All batches</option>
            {batches.map((batch) => <option key={batch._id} value={batch._id}>{batch.name}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Student</th>
              <th className="px-4 py-3 text-left font-semibold">Course/Batch</th>
              <th className="px-4 py-3 text-left font-semibold">Payment</th>
              <th className="px-4 py-3 text-left font-semibold">Admission</th>
              <th className="px-4 py-3 text-left font-semibold">Requested</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admissions.map((admission) => (
              <tr key={admission._id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{admission.studentName}</p>
                  <p className="text-gray-500">{admission.studentPhone}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{admission.courseName || admission.batchId?.subject || '-'}</p>
                  <p className="text-gray-500">{admission.batchName || admission.batchId?.name || admission.interestedBatch || '-'}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={admission.paymentStatus} />
                  <p className="mt-1 text-gray-500">{paymentMethodLabel(admission.paymentProvider || admission.paymentMethod) || 'No payment'}</p>
                  <p className="text-gray-500">TXN: {admission.transactionId || '-'}</p>
                  <p className="text-gray-500">Paid {formatCurrency(admission.paidAmount)} | Due {formatCurrency(admission.dueAmount)}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge status={admission.status} /></td>
                <td className="px-4 py-3">{formatDate(admission.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelected(admission)} className="text-xs btn-secondary">View</button>
                    <button onClick={() => approve(admission._id)} disabled={admission.status === 'approved'} className="text-xs btn-primary disabled:opacity-50">Approve</button>
                    <button onClick={() => reject(admission._id)} disabled={admission.status === 'approved' || admission.status === 'rejected'} className="text-xs btn-danger disabled:opacity-50">Reject</button>
                    <button onClick={() => handleDelete(admission._id)} className="text-xs btn-secondary">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {admissions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">No admission requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Admission Details">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <p><strong>Name:</strong> {selected.studentName}</p>
              <p><strong>Phone:</strong> {selected.studentPhone}</p>
              <p><strong>Guardian:</strong> {selected.guardianPhone || '-'}</p>
              <p><strong>Applicant:</strong> {selected.applicantUserId?.email || '-'}</p>
              <p><strong>Batch:</strong> {selected.batchName || selected.batchId?.name || '-'}</p>
              <p><strong>Course:</strong> {selected.courseName || selected.batchId?.subject || '-'}</p>
              <p><strong>Sender:</strong> {selected.senderAccountNumber || '-'}</p>
              <p><strong>Center Account:</strong> {selected.centerAccountNumber || '-'}</p>
              <p><strong>Transaction ID:</strong> {selected.transactionId || '-'}</p>
              <p><strong>Paid:</strong> {formatCurrency(selected.paidAmount)}</p>
              <p><strong>Due:</strong> {formatCurrency(selected.dueAmount)}</p>
              <p><strong>Payment Date:</strong> {selected.paymentDate ? formatDate(selected.paymentDate) : '-'}</p>
            </div>
            {selected.address && <p><strong>Address:</strong> {selected.address}</p>}
            {selected.message && <p><strong>Message:</strong> {selected.message}</p>}
            {selected.paymentNote && <p><strong>Payment Note:</strong> {selected.paymentNote}</p>}
            {selected.rejectedReason && <p><strong>Rejected Reason:</strong> {selected.rejectedReason}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAdmissions;
