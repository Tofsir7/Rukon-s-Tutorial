import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/constants';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/me').then((r) => setProfile(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!profile) return <div>Profile not found</div>;

  const fields = [
    { label: 'Student ID', value: profile.studentId },
    { label: 'Name', value: profile.name },
    { label: 'Phone', value: profile.phone },
    { label: 'Guardian Phone', value: profile.guardianPhone },
    { label: 'Class/Level', value: profile.classLevel },
    { label: 'School/College', value: profile.schoolCollege },
    { label: 'Batch', value: profile.batchId?.name || 'Not assigned' },
    { label: 'Address', value: profile.address },
    { label: 'Admission Date', value: formatDate(profile.admissionDate) },
    { label: 'Status', value: profile.status },
  ];

  return (
    <div>
      <h1 className="page-title mb-6">My Profile</h1>
      <div className="card max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="py-2 border-b">
              <p className="text-sm text-gray-500">{f.label}</p>
              <p className="font-medium capitalize">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
