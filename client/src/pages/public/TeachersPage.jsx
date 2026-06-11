import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teachers/public').then((r) => setTeachers(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Our Teachers</h1>
          <p className="text-primary-200 mt-2">Meet our experienced faculty members</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <LoadingSpinner className="py-20" />
          ) : teachers.length === 0 ? (
            <EmptyState title="No teachers listed" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher) => (
                <div key={teacher._id} className="card text-center">
                  <img
                    src={teacher.photo || '/images/teacher-placeholder.jpg'}
                    alt={teacher.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary-100"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=1e40af&color=fff&size=128`; }}
                  />
                  <h3 className="text-xl font-bold">{teacher.name}</h3>
                  <p className="text-primary-600 font-medium text-sm mb-3">{teacher.subject}</p>
                  <p className="text-gray-600 text-sm">{teacher.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeachersPage;
