import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Local component states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError(err || 'Something went wrong. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border-2 border-slate-100 bg-white p-8 shadow-sm">
        
        {/* Header Branding */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-[#0E1F2F]">Welcome back</h2>
          <p className="text-xs text-slate-400 font-medium">Sign in to manage your workspace workflows</p>
        </div>

        {/* Clean Error Alert */}
        {error && (
          <div className="rounded-2xl bg-red-50 border-2 border-red-100 p-4 text-xs font-bold text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-black text-[#26425A] uppercase tracking-wider mb-2">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium transition-all outline-none focus:border-[#26425A] focus:ring-4 focus:ring-slate-500/5"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#26425A] uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium transition-all outline-none focus:border-[#26425A] focus:ring-4 focus:ring-slate-500/5"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#0E1F2F] py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#26425A] focus:outline-none focus:ring-4 focus:ring-slate-500/10 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer tracking-wide"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#C38EB4] hover:text-[#b57ca5] transition-colors">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;