import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Alert from '../../components/Alert';
import { SITE } from '../../utils/constants';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });

    // Validation
    if (!formData.name.trim()) {
      setAlert({ type: 'error', message: 'Full name is required' });
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setAlert({ type: 'error', message: 'Email is required' });
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setAlert({ type: 'error', message: 'Password is required' });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone.trim(),
      });

      setAlert({
        type: 'success',
        message: 'Registration successful! Redirecting to login...',
      });

      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt=""
            className="h-16 w-16 mx-auto mb-3 rounded-xl"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-2xl font-bold text-gray-900">{SITE.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '' })}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+880 1234567890"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
              Log in here
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-2">Demo Credentials:</p>
          <p><strong>Admin:</strong> admin@rukons.com / admin123</p>
          <p><strong>Student:</strong> arif@rukons.com / student123</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
