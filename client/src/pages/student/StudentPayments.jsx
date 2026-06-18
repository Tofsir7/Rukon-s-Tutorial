import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, paymentMethodLabel } from '../../utils/constants';

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my').then((r) => { setPayments(r.data.data); setSummary(r.data.summary); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <h1 className="page-title mb-6">My Payments</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</div><div className="text-sm text-gray-500">Total Paid</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalDue)}</div><div className="text-sm text-gray-500">Total Due</div></div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-3 text-left">Month</th><th className="pb-3 text-left">Payable</th><th className="pb-3 text-left">Paid</th><th className="pb-3 text-left">Due</th><th className="pb-3 text-left">Method</th><th className="pb-3 text-left">Status</th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="py-3">{p.month}</td>
                <td className="py-3">{formatCurrency(p.payableAmount)}</td>
                <td className="py-3">{formatCurrency(p.paidAmount)}</td>
                <td className="py-3">{formatCurrency(p.dueAmount)}</td>
                <td className="py-3">{paymentMethodLabel(p.paymentMethod)}</td>
                <td className="py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPayments;
