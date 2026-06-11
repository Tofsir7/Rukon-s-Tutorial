import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/constants';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices/my').then((r) => setNotices(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (notices.length === 0) return <EmptyState title="No notices" icon="📢" />;

  return (
    <div>
      <h1 className="page-title mb-6">My Notices</h1>
      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n._id} className="card">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-500">{formatDate(n.createdAt)}</span>
              {n.batchId && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">{n.batchId.name}</span>}
            </div>
            <h3 className="font-bold text-lg mb-2">{n.title}</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{n.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentNotices;
