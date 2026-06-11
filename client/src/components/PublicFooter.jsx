import { Link } from 'react-router-dom';
import { SITE } from '../utils/constants';

const PublicFooter = () => (
  <footer className="bg-primary-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3">{SITE.name}</h3>
          <p className="text-primary-200 text-sm leading-relaxed">{SITE.about}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-primary-200">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
            <li><Link to="/admission" className="hover:text-white">Admission</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/login" className="hover:text-white">Student Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">Contact Info</h3>
          <ul className="space-y-2 text-sm text-primary-200">
            <li>📍 {SITE.address}</li>
            <li>📞 {SITE.phone}</li>
            <li>✉️ {SITE.email}</li>
            <li>🕐 {SITE.hours}</li>
            <li>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook Page
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-800 mt-8 pt-6 text-center text-sm text-primary-300">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </div>
  </footer>
);

export default PublicFooter;
