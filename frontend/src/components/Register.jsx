import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create account via /api/auth/register/
      await AuthService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // 2. Automatically log the user in to retrieve JWT tokens
      await login(formData.username, formData.password);
      navigate('/products');
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData) {
        // Extract field validation errors returned by DRF
        const firstErrorKey = Object.keys(responseData)[0];
        const errorVal = responseData[firstErrorKey];
        setError(Array.isArray(errorVal) ? `${firstErrorKey}: ${errorVal[0]}` : String(errorVal));
      } else {
        setError('Failed to create account. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-sm text-slate-500">Sign up to get full access to the API dashboard</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Username</label>
            <input
              required
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password</label>
            <input
              required
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition shadow text-sm"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating account...
              </>
            ) : (
              <>
                <UserPlus size={16} /> Register
              </>
            )}
          </button>
        </form>

        {/* <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p> */}
      </div>
    </div>
  );
}