import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { formatCurrency, formatDate, PAYMENT_METHODS } from '../../utils/constants';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [filters, setFilters] = useState({ month: '', batchId: '', status: '' });
  const [form, setForm] = useState({ studentId: '', batchId: '', month: '', payableAmount: '', paidAmount: '', paymentMethod: 'cash', note: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchPayments = () => {
    const params = new URLSearchParams(filters);
    api.get(`/payments?${params}`).then((r) => setPayments(r.data.data));
  };

  useEffect(() => {
    Promise.all([api.get('/students'), api.get('/batches'), api.get('/payments')])
      .then(([s, b, p]) => { setStudents(s.data.data); setBatches(b.data.data); setPayments(p.data.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (!loading) fetchPayments(); }, [filters]);

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setForm({ ...form, studentId, batchId: student?.batchId?._id || '', payableAmount: student?.batchId?.monthlyFee || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', { ...form, payableAmount: Number(form.payableAmount), paidAmount: Number(form.paidAmount) });
      setAlert({ type: 'success', message: 'Payment recorded' });
      setModalOpen(false);
      fetchPayments();
    } catch (err) { setAlert({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Payment Management</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">+ Add Payment</button>
      </div>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="card mb-6 grid sm:grid-cols-3 gap-4">
        <input type="month" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} className="input-field" />
        <select value={filters.batchId} onChange={(e) => setFilters({ ...filters, batchId: e.target.value })} className="input-field"><option value="">All Batches</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="input-field"><option value="">All Status</option><option value="paid">Paid</option><option value="partial">Partial</option><option value="due">Due</option></select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="pb-3 pr-4">Student</th><th className="pb-3 pr-4">Month</th><th className="pb-3 pr-4">Payable</th><th className="pb-3 pr-4">Paid</th><th className="pb-3 pr-4">Due</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="py-3 pr-4">{p.studentId?.name}</td>
                <td className="py-3 pr-4">{p.month}</td>
                <td className="py-3 pr-4">{formatCurrency(p.payableAmount)}</td>
                <td className="py-3 pr-4">{formatCurrency(p.paidAmount)}</td>
                <td className="py-3 pr-4">{formatCurrency(p.dueAmount)}</td>
                <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                <td className="py-3"><button onClick={() => setReceipt(p)} className="text-primary-600 hover:underline">Receipt</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Payment">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-sm font-medium">Student</label><select value={form.studentId} onChange={(e) => handleStudentChange(e.target.value)} required className="input-field"><option value="">Select</option>{students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
          <div><label className="text-sm font-medium">Batch</label><select value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required className="input-field"><option value="">Select</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
          <div><label className="text-sm font-medium">Month</label><input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required className="input-field" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Payable</label><input type="number" value={form.payableAmount} onChange={(e) => setForm({ ...form, payableAmount: e.target.value })} required className="input-field" /></div>
            <div><label className="text-sm font-medium">Paid</label><input type="number" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} required className="input-field" /></div>
          </div>
          <div><label className="text-sm font-medium">Method</label><select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="input-field">{PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
          <div><label className="text-sm font-medium">Note</label><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="input-field" /></div>
          <button type="submit" className="btn-primary">Save Payment</button>
        </form>
      </Modal>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Payment Receipt" size="md">
        {receipt && (
          <div className="text-center" id="receipt">
            <h3 className="font-bold text-lg mb-4">Rukon's Tutorial</h3>
            <p className="text-sm text-gray-500 mb-4">Payment Receipt</p>
            <div className="text-left space-y-2 text-sm border-t border-b py-4">
              <p><strong>Student:</strong> {receipt.studentId?.name}</p>
              <p><strong>Month:</strong> {receipt.month}</p>
              <p><strong>Payable:</strong> {formatCurrency(receipt.payableAmount)}</p>
              <p><strong>Paid:</strong> {formatCurrency(receipt.paidAmount)}</p>
              <p><strong>Due:</strong> {formatCurrency(receipt.dueAmount)}</p>
              <p><strong>Method:</strong> {receipt.paymentMethod}</p>
              <p><strong>Date:</strong> {formatDate(receipt.paymentDate)}</p>
            </div>
            <button onClick={() => window.print()} className="btn-primary mt-4 no-print">Print Receipt</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPayments;
