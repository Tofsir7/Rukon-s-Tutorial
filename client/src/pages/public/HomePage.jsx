import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { SITE } from '../../utils/constants';

const HomePage = () => {
  const [batches, setBatches] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    api.get('/batches/public').then((r) => setBatches(r.data.data.slice(0, 4))).catch(() => { });
    api.get('/notices/public').then((r) => setNotices(r.data.data.slice(0, 3))).catch(() => { });
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-accent-500/20 text-accent-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                JSC • SSC • HSC Preparation
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Welcome to {SITE.name}
              </h1>
              <p className="text-primary-100 text-lg mb-6 leading-relaxed">
                {SITE.tagline}. Expert coaching in Science & Mathematics for Class 8-12 students in Katiadi, Kishoreganj.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/admission" className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Apply for Admission
                </Link>
                <Link to="/courses" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition border border-white/20">
                  View Courses
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="/images/teacher-1.png" alt="Mr. Rukon" className="rounded-2xl shadow-2xl object-cover h-80" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop'; }} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">About Our Coaching Center</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">{SITE.about}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Focused Learning', desc: 'Specialized programs for board exam preparation' },
              { icon: '👨‍🏫', title: 'Expert Teachers', desc: 'Experienced faculty in Science & Mathematics' },
              { icon: '📈', title: 'Proven Results', desc: 'Consistent success in JSC, SSC, and HSC exams' },
            ].map((item) => (
              <div key={item.title} className="card text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Popular Courses & Batches</h2>
            <Link to="/courses" className="text-primary-600 hover:underline font-medium">View All →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {batches.map((batch) => (
              <div key={batch._id} className="card hover:shadow-md transition">
                <div className="text-primary-600 text-sm font-medium mb-1">{batch.classLevel}</div>
                <h3 className="font-bold text-lg mb-2">{batch.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{batch.subject} • {batch.teacherName}</p>
                <p className="text-sm text-gray-500">{batch.schedule} | {batch.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Small Batch Size', desc: 'Personal attention for every student' },
              { title: 'Regular Tests', desc: 'Monthly exams and progress tracking' },
              { title: 'Study Materials', desc: 'Notes, assignments & recorded classes' },
              { title: 'Affordable Fees', desc: 'Quality education at reasonable cost' },
            ].map((item) => (
              <div key={item.title} className="border-l-4 border-primary-600 pl-4">
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {notices.length > 0 && (
        <section className="py-12 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold mb-4">📢 Latest Notices</h2>
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-primary-600 font-medium text-sm whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString()}</span>
                  <div>
                    <h4 className="font-medium">{n.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-1">{n.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-100 mb-6">Join hundreds of successful students at {SITE.name}. Apply for admission today!</p>
          <Link to="/admission" className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg font-semibold transition">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
