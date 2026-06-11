import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/Alert';
import { SITE } from '../../utils/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      const redirect = searchParams.get('redirect');
      navigate(redirect || (user.role === 'admin' ? '/admin' : '/student'));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="" className="h-16 w-16 mx-auto mb-3 rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
          <h1 className="text-2xl font-bold text-gray-900">{SITE.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account</p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-2">Demo Credentials:</p>
          <p><strong>Admin:</strong> admin@rukons.com / admin123</p>
          <p><strong>Student:</strong> arif@rukons.com / student123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
