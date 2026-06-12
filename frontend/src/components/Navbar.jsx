import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Left Side: Brand Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold tracking-tight text-zinc-900">
              TaskFlow<span className="text-zinc-400">.</span>
            </Link>

            <div className="flex items-center gap-1">
              {user?.role === 'Admin' ? (
                <>
                  <Link to="/" className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/admin/logs" className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                    Activity Logs
                  </Link>
                  <Link to="/admin/analytics" className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                    Analytics
                  </Link>
                </>
              ) : (
                <Link to="/" className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                  My Tasks
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: User Info Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-700">{user?.name}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 tracking-wide uppercase">
                {user?.role}
              </span>
            </div>

            <div className="h-4 w-[1px] bg-zinc-200" />

            <button
              onClick={handleLogout}
              className="text-xs font-medium text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;