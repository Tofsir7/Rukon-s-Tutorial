import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import { AdminLayout, StudentLayout } from './layouts/DashboardLayout';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import CoursesPage from './pages/public/CoursesPage';
import TeachersPage from './pages/public/TeachersPage';
import AdmissionPage from './pages/public/AdmissionPage';
import NoticesPage from './pages/public/NoticesPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminBatches from './pages/admin/AdminBatches';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminPayments from './pages/admin/AdminPayments';
import AdminExams from './pages/admin/AdminExams';
import AdminNotices from './pages/admin/AdminNotices';
import AdminMaterials from './pages/admin/AdminMaterials';
import AdminAdmissions from './pages/admin/AdminAdmissions';
import AdminTeachers from './pages/admin/AdminTeachers';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentBatch from './pages/student/StudentBatch';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentPayments from './pages/student/StudentPayments';
import StudentResults from './pages/student/StudentResults';
import StudentNotices from './pages/student/StudentNotices';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentAdmissions from './pages/student/StudentAdmissions';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="batches" element={<AdminBatches />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="materials" element={<AdminMaterials />} />
        <Route path="admissions" element={<AdminAdmissions />} />
        <Route path="teachers" element={<AdminTeachers />} />
      </Route>

      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="admissions" element={<StudentAdmissions />} />
        <Route path="batch" element={<StudentBatch />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="materials" element={<StudentMaterials />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
