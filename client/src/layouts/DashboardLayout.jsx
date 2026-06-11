import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../utils/constants';

const adminMenu = [
  { path: '/admin', label: 'Dashboard', icon: 'DB' },
  { path: '/admin/students', label: 'Students', icon: 'ST' },
  { path: '/admin/batches', label: 'Batches', icon: 'BA' },
  { path: '/admin/attendance', label: 'Attendance', icon: 'AT' },
  { path: '/admin/payments', label: 'Payments', icon: 'PY' },
  { path: '/admin/exams', label: 'Exams & Results', icon: 'EX' },
  { path: '/admin/notices', label: 'Notices', icon: 'NO' },
  { path: '/admin/materials', label: 'Study Materials', icon: 'MT' },
  { path: '/admin/admissions', label: 'Admissions', icon: 'AD' },
  { path: '/admin/teachers', label: 'Teachers', icon: 'TE' },
];

export const studentMenu = [
  { path: '/student', label: 'Dashboard', icon: 'DB' },
  { path: '/student/profile', label: 'My Profile', icon: 'PR' },
  { path: '/student/admissions', label: 'Admissions', icon: 'AD' },
  { path: '/student/batch', label: 'My Batch', icon: 'BA' },
  { path: '/student/attendance', label: 'Attendance', icon: 'AT' },
  { path: '/student/payments', label: 'Payments', icon: 'PY' },
  { path: '/student/results', label: 'Results', icon: 'RS' },
  { path: '/student/notices', label: 'Notices', icon: 'NO' },
  { path: '/student/materials', label: 'Study Materials', icon: 'MT' },
];

const DashboardLayout = ({ menu, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-900 text-white transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-primary-800">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="" className="h-8 w-8 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-bold text-sm">{SITE.name}</span>
          </Link>
          <p className="text-xs text-primary-300 mt-1">{title}</p>
        </div>

        <nav className="p-3 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                location.pathname === item.path ? 'bg-primary-700 text-white' : 'text-primary-200 hover:bg-primary-800'
              }`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-white/10 text-[10px] font-bold">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary-200 hover:bg-primary-800 transition">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-white/10 text-[10px] font-bold">LO</span>
            Logout
          </button>
        </nav>
      </aside>

      <div className="lg:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)} aria-label="Open dashboard menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-600">Welcome, <strong>{user?.name}</strong></span>
              <Link to="/" className="text-sm text-primary-600 hover:underline">View Website</Link>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AdminLayout = () => <DashboardLayout menu={adminMenu} title="Admin Panel" />;

export const StudentLayout = () => <DashboardLayout menu={studentMenu} title="Student Portal" />;

export default DashboardLayout;
