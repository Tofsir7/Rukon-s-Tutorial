import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';

const AdminAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [history, setHistory] = useState([]);
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    api.get('/batches').then((r) => { setBatches(r.data.data); if (r.data.data.length) setBatchId(r.data.data[0]._id); });
    api.get('/attendance/history').then((r) => setHistory(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (batchId) {
      api.get(`/attendance/percentage?batchId=${batchId}`).then((r) => setPercentages(r.data.data)).catch(() => {});
    }
  }, [batchId]);

  const loadAttendance = async () => {
    if (!batchId || !date) return;
    setLoading(true);
    try {
      const res = await api.get(`/attendance?batchId=${batchId}&date=${date}`);
      const data = res.data.data;
      if (data.records) {
        setRecords(data.records.map((r) => ({
          studentId: r.studentId?._id || r.studentId,
          name: r.studentId?.name || 'Unknown',
          status: r.status,
        })));
      }
    } catch { setAlert({ type: 'error', message: 'Failed to load attendance' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (batchId && date) loadAttendance(); }, [batchId, date]);

  const toggleStatus = (idx) => {
    const updated = [...records];
    updated[idx].status = updated[idx].status === 'present' ? 'absent' : 'present';
    setRecords(updated);
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      await api.post('/attendance', {
        batchId, date,
        records: records.map((r) => ({ studentId: r.studentId, status: r.status })),
      });
      setAlert({ type: 'success', message: 'Attendance saved' });
      api.get('/attendance/history').then((r) => setHistory(r.data.data));
    } catch (err) { setAlert({ type: 'error', message: err.response?.data?.message || 'Save failed' }); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="page-title mb-6">Attendance Management</h1>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="card mb-6">
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div><label className="text-sm font-medium">Batch</label><select value={batchId} onChange={(e) => setBatchId(e.target.value)} className="input-field">{batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
          <div><label className="text-sm font-medium">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" /></div>
          <button onClick={saveAttendance} disabled={saving || records.length === 0} className="btn-primary">{saving ? 'Saving...' : 'Save Attendance'}</button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-gray-500"><th className="pb-3">Student</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr></thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.studentId} className="border-b">
                  <td className="py-3 font-medium">{r.name}</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
                  <td className="py-3"><button onClick={() => toggleStatus(i)} className="text-primary-600 hover:underline">Toggle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold mb-4">Attendance Percentage</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {percentages.map((p) => (
              <div key={p.student._id} className="flex justify-between items-center py-2 border-b">
                <span>{p.student.name}</span>
                <span className={`font-bold ${p.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="font-bold mb-4">Recent History</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.slice(0, 10).map((h) => (
              <div key={h._id} className="py-2 border-b text-sm">
                <span className="font-medium">{h.batchId?.name}</span> — {new Date(h.date).toLocaleDateString()} ({h.records?.length} students)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
