import { useState } from 'react';
import api from '../../services/api';
import Alert from '../../components/Alert';
import { SITE } from '../../utils/constants';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setAlert({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-primary-200 mt-2">Get in touch with us</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4 mb-8">
              <div className="flex gap-3"><span className="text-2xl">📍</span><div><strong>Address</strong><p className="text-gray-600">{SITE.address}</p></div></div>
              <div className="flex gap-3"><span className="text-2xl">📞</span><div><strong>Phone</strong><p className="text-gray-600">{SITE.phone}</p></div></div>
              <div className="flex gap-3"><span className="text-2xl">✉️</span><div><strong>Email</strong><p className="text-gray-600">{SITE.email}</p></div></div>
              <div className="flex gap-3"><span className="text-2xl">🕐</span><div><strong>Opening Hours</strong><p className="text-gray-600">{SITE.hours}</p></div></div>
              <div className="flex gap-3"><span className="text-2xl">📘</span><div><strong>Facebook</strong><p><a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Rukon's Tutorial</a></p></div></div>
            </div>
            <div className="rounded-xl overflow-hidden h-64 bg-gray-200">
              <iframe
                title="Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <a href={SITE.mapLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-primary-600 hover:underline text-sm">
              Open in Google Maps →
            </a>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Name *</label><input name="name" value={form.name} onChange={handleChange} required className="input-field" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input name="phone" value={form.phone} onChange={handleChange} className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Subject</label><input name="subject" value={form.subject} onChange={handleChange} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Message *</label><textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="input-field" /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
