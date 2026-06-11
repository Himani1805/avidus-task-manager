import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to manage mobile sidebar overlay drawer only
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user?.role === 'Admin' 
    ? [
        { label: 'Dashboard', path: '/' },
        { label: 'Analytics', path: '/admin/analytics' },
        { label: 'Activity Logs', path: '/admin/logs' }
      ]
    : [
        { label: 'My Tasks', path: '/' }
      ];

  const isActive = (path) => location.pathname === path;

  return (
    // Height & Scroll Fix: Viewport completely locked
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 text-slate-900 font-sans">
      
      {/* Topbar/Header: Stays static at h-16 */}
      <header className="h-16 flex-shrink-0 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50">
        <div className="flex items-center gap-3">
          {/* Hamburger Button: Visible ONLY on mobile to open drawer */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* SaaS Branding Logo */}
          <Link to="/" className="text-sm font-semibold tracking-tight text-slate-900">
            TaskFlow<span className="text-indigo-500">.</span>
          </Link>
        </div>

        {/* Right Section: Profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 hidden sm:inline">{user?.name}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 tracking-wide uppercase">
              {user?.role}
            </span>
          </div>
          
          <div className="h-4 w-[1px] bg-slate-200" />
          
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container below Topbar */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Drawer Overlay Backdrop: Visible ONLY on mobile when menu is active */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR: Permanent on desktop (md:static), drawer overlay on mobile (fixed) */}
        <aside className={`
          fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-100 p-4 z-40 
          h-full overflow-y-auto flex-shrink-0 transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)} // Auto close overlay on mobile pick
                className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-indigo-50/60 text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full mr-2.5 transition-colors ${
                  isActive(item.path) ? 'bg-indigo-500' : 'bg-slate-300'
                }`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA: Flex-1 takes remaining space without any overlapping bugs */}
        <main className="flex-1 h-full overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;