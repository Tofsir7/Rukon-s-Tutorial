import { useEffect, useState } from 'react';
import api from '../../services/api';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { formatCurrency, formatDate } from '../../utils/constants';

const StudentAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    api
      .get('/admissions/my')
      .then((res) => setAdmissions(res.data.data))
      .catch((err) => setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to load admission requests' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <h1 className="page-title mb-6">My Admission Requests</h1>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      {admissions.length === 0 ? (
        <EmptyState title="No admission requests" message="Your submitted admission requests will appear here." />
      ) : (
        <div className="space-y-4">
          {admissions.map((admission) => (
            <div key={admission._id} className="card">
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-lg">{admission.batchName || admission.batchId?.name || admission.interestedBatch}</h3>
                  <p className="text-sm text-gray-500">{admission.courseName || admission.batchId?.subject || 'Course'} - {formatDate(admission.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={admission.status} />
                  <StatusBadge status={admission.paymentStatus} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                <p>Payable: <strong>{formatCurrency(admission.payableAmount)}</strong></p>
                <p>Paid: <strong>{formatCurrency(admission.paidAmount)}</strong></p>
                <p>Due: <strong>{formatCurrency(admission.dueAmount)}</strong></p>
                <p>Transaction: <strong>{admission.transactionId || '-'}</strong></p>
              </div>
              {admission.rejectedReason && <p className="mt-3 text-sm text-red-600">Rejected reason: {admission.rejectedReason}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAdmissions;
