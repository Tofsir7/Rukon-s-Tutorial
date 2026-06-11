import { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';
import { getGradeColor } from '../../utils/constants';

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examModal, setExamModal] = useState(false);
  const [resultModal, setResultModal] = useState(null);
  const [results, setResults] = useState([]);
  const [examForm, setExamForm] = useState({ title: '', batchId: '', subject: '', totalMarks: '', examDate: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    Promise.all([api.get('/exams'), api.get('/batches')]).then(([e, b]) => {
      setExams(e.data.data); setBatches(b.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const createExam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/exams', { ...examForm, totalMarks: Number(examForm.totalMarks) });
      setAlert({ type: 'success', message: 'Exam created' });
      setExamModal(false);
      api.get('/exams').then((r) => setExams(r.data.data));
    } catch (err) { setAlert({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
  };

  const openResults = async (exam) => {
    const batchStudents = await api.get(`/batches/${exam.batchId._id || exam.batchId}/students`);
    setStudents(batchStudents.data.data);
    const existing = await api.get(`/exams/${exam._id}/results`);
    const resultMap = {};
    existing.data.data.forEach((r) => { resultMap[r.studentId._id || r.studentId] = r.marks; });
    setResults(batchStudents.data.data.map((s) => ({ studentId: s._id, name: s.name, marks: resultMap[s._id] || '' })));
    setResultModal(exam);
  };

  const saveResults = async () => {
    try {
      await api.post('/exams/results', {
        examId: resultModal._id,
        results: results.filter((r) => r.marks !== '').map((r) => ({ studentId: r.studentId, marks: Number(r.marks) })),
      });
      setAlert({ type: 'success', message: 'Results saved' });
      setResultModal(null);
    } catch (err) { setAlert({ type: 'error', message: err.response?.data?.message || 'Failed' }); }
  };

  const deleteExam = async (id) => {
    if (!confirm('Delete exam and all results?')) return;
    await api.delete(`/exams/${id}`);
    setExams(exams.filter((e) => e._id !== id));
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Exams & Results</h1>
        <button onClick={() => setExamModal(true)} className="btn-primary">+ Create Exam</button>
      </div>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />

      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam._id} className="card flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-bold">{exam.title}</h3>
              <p className="text-sm text-gray-500">{exam.batchId?.name} • {exam.subject} • Total: {exam.totalMarks} marks</p>
              <p className="text-xs text-gray-400">{new Date(exam.examDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openResults(exam)} className="btn-primary text-sm">Enter Results</button>
              <button onClick={() => deleteExam(exam._id)} className="btn-danger text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={examModal} onClose={() => setExamModal(false)} title="Create Exam">
        <form onSubmit={createExam} className="space-y-3">
          <div><label className="text-sm font-medium">Title</label><input value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} required className="input-field" /></div>
          <div><label className="text-sm font-medium">Batch</label><select value={examForm.batchId} onChange={(e) => setExamForm({ ...examForm, batchId: e.target.value })} required className="input-field"><option value="">Select</option>{batches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
          <div><label className="text-sm font-medium">Subject</label><input value={examForm.subject} onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })} required className="input-field" /></div>
          <div><label className="text-sm font-medium">Total Marks</label><input type="number" value={examForm.totalMarks} onChange={(e) => setExamForm({ ...examForm, totalMarks: e.target.value })} required className="input-field" /></div>
          <div><label className="text-sm font-medium">Exam Date</label><input type="date" value={examForm.examDate} onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })} required className="input-field" /></div>
          <button type="submit" className="btn-primary">Create</button>
        </form>
      </Modal>

      <Modal open={!!resultModal} onClose={() => setResultModal(null)} title={`Results - ${resultModal?.title}`} size="lg">
        <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
          {results.map((r, i) => (
            <div key={r.studentId} className="flex items-center gap-4">
              <span className="flex-1">{r.name}</span>
              <input type="number" max={resultModal?.totalMarks} value={r.marks} onChange={(e) => { const u = [...results]; u[i].marks = e.target.value; setResults(u); }} className="input-field w-24" placeholder="Marks" />
              {r.marks && <span className={`font-bold ${getGradeColor(r.marks / resultModal.totalMarks >= 0.8 ? 'A' : 'C')}`}>{Math.round((r.marks / resultModal.totalMarks) * 100)}%</span>}
            </div>
          ))}
        </div>
        <button onClick={saveResults} className="btn-primary">Save Results</button>
      </Modal>
    </div>
  );
};

export default AdminExams;
