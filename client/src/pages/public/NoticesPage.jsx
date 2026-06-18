import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/constants';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices/public').then((r) => setNotices(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Notices</h1>
          <p className="text-primary-200 mt-2">Latest announcements and updates</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {loading ? (
            <LoadingSpinner className="py-20" />
          ) : notices.length === 0 ? (
            <EmptyState title="No notices" message="Check back later for updates" icon="📢" />
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice._id} className="card">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-500">{formatDate(notice.createdAt)}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{notice.title}</h3>
                  {notice.noticeImageUrl && (
                    <img
                      src={notice.noticeImageUrl}
                      alt={notice.title}
                      className="mb-3 max-h-80 w-full rounded-lg object-cover"
                    />
                  )}
                  <p className="text-gray-600 whitespace-pre-wrap">{notice.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NoticesPage;
