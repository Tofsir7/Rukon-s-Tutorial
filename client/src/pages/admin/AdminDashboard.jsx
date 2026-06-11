import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/constants';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin').then((r) => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!stats) return <div className="text-center text-gray-500">Failed to load dashboard</div>;

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓', color: 'bg-blue-500' },
    { label: 'Active Batches', value: stats.totalBatches, icon: '📚', color: 'bg-green-500' },
    { label: 'Published Notices', value: stats.totalNotices, icon: '📢', color: 'bg-purple-500' },
    { label: 'Monthly Collected', value: formatCurrency(stats.monthlyCollected), icon: '💰', color: 'bg-emerald-500' },
    { label: 'Total Due', value: formatCurrency(stats.totalDue), icon: '⚠️', color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="page-title mb-6">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className={`w-2 h-2 rounded-full ${card.color}`}></span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Recent Admissions</h2>
            <Link to="/admin/admissions" className="text-primary-600 text-sm hover:underline">View All</Link>
          </div>
          {stats.recentAdmissions?.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent admissions</p>
          ) : (
            <div className="space-y-3">
              {stats.recentAdmissions?.map((a) => (
                <div key={a._id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{a.studentName}</p>
                    <p className="text-xs text-gray-500">{a.interestedBatch}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(a.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-bold text-lg mb-4">Today's Classes</h2>
          {stats.todaysClasses?.length === 0 ? (
            <p className="text-gray-500 text-sm">No classes scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {stats.todaysClasses?.map((b) => (
                <div key={b._id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-gray-500">{b.time} • Room {b.room}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
