import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SITE } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/courses', label: 'Courses' },
  { path: '/teachers', label: 'Teachers' },
  { path: '/notices', label: 'Notices' },
  { path: '/admission', label: 'Admission' },
  { path: '/contact', label: 'Contact' },
];

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt={SITE.name}
              className="h-10 w-10 object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/logo-placeholder.svg';
              }}
            />
            <div>
              <span className="font-bold text-primary-800 text-lg">{SITE.name}</span>
              <p className="text-xs text-gray-500 hidden sm:block">Katiadi, Kishoreganj</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200">
                {user.role === 'student' && (
                  <Link to="/student" className="text-sm text-gray-600 hover:text-primary-700">
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-gray-600 hover:text-primary-700">
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-10">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="ml-4 flex items-center gap-2 pl-4 border-l border-gray-200">
                <Link to="/register" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700">
                  Register
                </Link>
                <Link to="/login" className="btn-primary text-sm">
                  Login
                </Link>
              </div>
            )}
          </nav>

          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="lg:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="pt-2 border-t mt-2">
                {user.role === 'student' && (
                  <Link
                    to="/student"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600"
                  >
                    Admin
                  </Link>
                )}
                <div className="px-3 py-2 text-sm font-medium text-gray-700">{user.name}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t mt-2 space-y-2">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block btn-primary text-center text-sm"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;
