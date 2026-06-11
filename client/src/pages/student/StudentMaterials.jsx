import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/materials/my').then((r) => setMaterials(r.data.data)).finally(() => setLoading(false));
  }, []);

  const typeIcons = { pdf: '📄', note: '📝', assignment: '📋', recorded_class: '🎥', model_test: '📊' };

  if (loading) return <LoadingSpinner className="py-20" />;
  if (materials.length === 0) return <EmptyState title="No materials" message="Study materials for your batch will appear here" icon="📁" />;

  return (
    <div>
      <h1 className="page-title mb-6">Study Materials & Recorded Classes</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((m) => (
          <div key={m._id} className="card hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{typeIcons[m.type] || '📁'}</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">{m.type.replace('_', ' ')}</span>
            </div>
            <h3 className="font-bold mb-1">{m.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{m.subject}</p>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{m.description}</p>
            <a href={m.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm inline-block">
              {m.type === 'recorded_class' ? 'Watch Class' : 'Open Material'}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentMaterials;
