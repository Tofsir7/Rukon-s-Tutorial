import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { SITE } from '../utils/constants';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/courses', label: 'Courses' },
  { path: '/teachers', label: 'Teachers' },
  { path: '/results', label: 'Results' },
  { path: '/notices', label: 'Notices' },
  { path: '/admission', label: 'Admission' },
  { path: '/contact', label: 'Contact' },
];

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt={SITE.name} className="h-10 w-10 object-contain rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src = '/images/logo-placeholder.svg'; }} />
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
                  location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" className="ml-2 btn-primary text-sm">
              Login
            </Link>
          </nav>

          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
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
            <Link to="/login" onClick={() => setOpen(false)} className="block btn-primary text-center mt-2">
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PublicNavbar;
