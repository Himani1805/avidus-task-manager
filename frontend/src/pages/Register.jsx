import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Local component states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 1. Create user account
      await register(name, email, password);
      // 2. Log them in directly for a frictionless SaaS UX
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err || 'Registration failed. Please try a different email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        
        {/* Header Branding */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Create your account</h2>
          <p className="mt-1.5 text-xs text-slate-500">Get started with clean, automated task workflows</p>
        </div>

        {/* Clean Error Alert */}
        {error && (
          <div className="rounded-lg bg-red-50/70 border border-red-100 p-3 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              placeholder="Rahul Kumar"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:bg-slate-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Creating account...' : 'Get started'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;