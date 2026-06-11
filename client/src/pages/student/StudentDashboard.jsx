import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/constants';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/student').then((r) => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!data) return <div className="text-center text-gray-500">Failed to load dashboard</div>;

  const { student, notices, materials, payments, attendanceSummary, totalDue } = data;

  return (
    <div>
      <h1 className="page-title mb-2">Welcome, {student.name}!</h1>
      <p className="text-gray-500 mb-6">Student ID: {student.studentId}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card"><span className="text-2xl mb-2">📚</span><div className="font-bold">{student.batchId?.name || 'Not Assigned'}</div><div className="text-sm text-gray-500">My Batch</div></div>
        <div className="stat-card"><span className="text-2xl mb-2">✅</span><div className="font-bold">{attendanceSummary.percentage}%</div><div className="text-sm text-gray-500">Attendance</div></div>
        <div className="stat-card"><span className="text-2xl mb-2">💰</span><div className="font-bold text-red-600">{formatCurrency(totalDue)}</div><div className="text-sm text-gray-500">Total Due</div></div>
        <div className="stat-card"><span className="text-2xl mb-2">📢</span><div className="font-bold">{notices.length}</div><div className="text-sm text-gray-500">Recent Notices</div></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between mb-4"><h2 className="font-bold">Recent Notices</h2><Link to="/student/notices" className="text-primary-600 text-sm">View All</Link></div>
          {notices.length === 0 ? <p className="text-gray-500 text-sm">No notices</p> : notices.map((n) => (
            <div key={n._id} className="py-2 border-b last:border-0"><p className="font-medium text-sm">{n.title}</p><p className="text-xs text-gray-500">{formatDate(n.createdAt)}</p></div>
          ))}
        </div>
        <div className="card">
          <div className="flex justify-between mb-4"><h2 className="font-bold">Latest Materials</h2><Link to="/student/materials" className="text-primary-600 text-sm">View All</Link></div>
          {materials.length === 0 ? <p className="text-gray-500 text-sm">No materials</p> : materials.map((m) => (
            <div key={m._id} className="py-2 border-b last:border-0 flex justify-between"><span className="text-sm font-medium">{m.title}</span><a href={m.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs">Open</a></div>
          ))}
        </div>
        <div className="card lg:col-span-2">
          <div className="flex justify-between mb-4"><h2 className="font-bold">Payment Status</h2><Link to="/student/payments" className="text-primary-600 text-sm">View All</Link></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-gray-500"><th className="pb-2 text-left">Month</th><th className="pb-2 text-left">Paid</th><th className="pb-2 text-left">Due</th><th className="pb-2 text-left">Status</th></tr></thead>
              <tbody>{payments.map((p) => (
                <tr key={p._id} className="border-b"><td className="py-2">{p.month}</td><td className="py-2">{formatCurrency(p.paidAmount)}</td><td className="py-2">{formatCurrency(p.dueAmount)}</td><td className="py-2"><StatusBadge status={p.status} /></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
