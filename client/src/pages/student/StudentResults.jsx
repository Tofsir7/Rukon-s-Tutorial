import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { formatDate, getGradeColor } from '../../utils/constants';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/exams/results/student').then((r) => setResults(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (results.length === 0) return <EmptyState title="No results yet" message="Your exam results will appear here" icon="📝" />;

  return (
    <div>
      <h1 className="page-title mb-6">My Results</h1>
      <div className="space-y-4">
        {results.map((r) => (
          <div key={r._id} className="card">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <h3 className="font-bold text-lg">{r.examId?.title}</h3>
                <p className="text-sm text-gray-500">{r.examId?.subject} • {formatDate(r.examId?.examDate)}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getGradeColor(r.grade)}`}>{r.grade}</div>
                <div className="text-sm text-gray-500">{r.marks}/{r.examId?.totalMarks} ({r.percentage}%)</div>
              </div>
            </div>
            {r.remarks && <p className="text-sm text-gray-600 mt-2 italic">{r.remarks}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentResults;
