import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Extract initial for the sharp charcoal avatar circle
    const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

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
        // Locked viewport with soft neutral tint bg-[#F8FAFC] to let cards pop
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased">

            {/* 1. PREMIUM HEADER NAVBAR */}
            <header className="h-16 flex-shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-50">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>

                    {/* Charcoal Slate Logo */}
                    <Link to="/" className="text-xl font-bold tracking-tight text-slate-800">
                        TaskFlow<span className="text-indigo-500">.</span>
                    </Link>
                </div>

                {/* Profile & Actions Area */}
                <div className="flex items-center">
                    <div className="flex items-center">
                        {/* Smooth Circular User Avatar */}
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm tracking-wider shadow-sm select-none">
                            {userInitials}
                        </div>

                        <div className="flex items-center ml-3">
                            <span className="text-sm font-medium text-slate-700 tracking-tight">{user?.name}</span>
                            {/* Minimalist Expensive Badge Layout */}
                            <span className="bg-slate-50 text-slate-500 border border-slate-200/60 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ml-2 select-none">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Muted Utility Link Action */}
                    <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors ml-6 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Workspace Frame */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Mobile Backdrop Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Royal Dark Navy Sidebar (Kept intact as requested) */}
                <aside className={`
          fixed md:static inset-y-0 left-0 w-64 bg-[#0E1F2F] z-40 
          h-full overflow-y-auto flex-shrink-0 transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
                    <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-6 pt-6 pb-3">
                        Menu Navigation
                    </div>

                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center transition-all duration-150 text-sm px-4 py-3 ${isActive(item.path)
                                        ? 'bg-white/10 text-white font-semibold border-l-4 border-indigo-400 rounded-r-xl rounded-l-none'
                                        : 'text-slate-400 font-medium rounded-xl hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Workspace Canvas Panel */}
                <main className="flex-1 h-full overflow-y-auto p-6 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Layout;