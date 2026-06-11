import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/constants';

const StudentAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/student').then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  const { records, summary } = data || { records: [], summary: {} };

  return (
    <div>
      <h1 className="page-title mb-6">My Attendance</h1>

      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <div className="stat-card text-center"><div className="text-2xl font-bold text-green-600">{summary.present || 0}</div><div className="text-sm text-gray-500">Present</div></div>
        <div className="stat-card text-center"><div className="text-2xl font-bold text-red-600">{summary.absent || 0}</div><div className="text-sm text-gray-500">Absent</div></div>
        <div className="stat-card text-center"><div className="text-2xl font-bold">{summary.total || 0}</div><div className="text-sm text-gray-500">Total Classes</div></div>
        <div className="stat-card text-center"><div className={`text-2xl font-bold ${summary.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>{summary.percentage || 0}%</div><div className="text-sm text-gray-500">Percentage</div></div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-gray-500"><th className="pb-3 text-left">Date</th><th className="pb-3 text-left">Status</th></tr></thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="border-b"><td className="py-3">{formatDate(r.date)}</td><td className="py-3"><StatusBadge status={r.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendance;
