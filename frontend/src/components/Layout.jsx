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
            { label: 'User Management', path: '/admin/users' },
            { label: 'Task Monitoring', path: '/admin/tasks' },
            { label: 'Activity Logs', path: '/admin/logs' }
        ]
        : [
            { label: 'My Tasks', path: '/' }
        ];

    const isActive = (path) => location.pathname === path;

    return (
        // Locked viewport with soft neutral tint bg-[#F8FAFC]
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased">

            {/* 1. PREMIUM HIGH-CONTRAST HEADER NAVBAR */}
            <header className="h-16 flex-shrink-0 bg-white border-b-2 border-slate-100 flex items-center justify-between px-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)] z-50">

                {/* Left Wing: Logo container perfectly inline */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>

                    {/* Charcoal Slate Logo - Matched to match bold typography theme */}
                    <Link to="/" className="text-xl font-black tracking-tight text-[#0E1F2F] flex items-center select-none">
                        TaskFlow<span className="text-[#86A8CF]">.</span>
                    </Link>
                </div>

                {/* Right Wing: High-End Profile Widget & Logout perfectly centered */}
                <div className="flex items-center space-x-6 h-full">

                    {/* Profile Wrapper Panel styled with precise tracking alignments */}
                    <div className="flex items-center bg-slate-50 border-2 border-slate-200/60 pl-2 pr-4 py-1 rounded-full shadow-xs h-11">

                        {/* Centered User Initials Avatar Circle - Font weight locked to black */}
                        <div className="w-8 h-8 rounded-full bg-[#0E1F2F] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm flex-shrink-0 select-none">
                            {userInitials}
                        </div>

                        {/* Metadata Text Core Fix: Flex container with font-bold alignment */}
                        <div className="flex items-center gap-2.5 ml-3 h-full">
                            <span className="text-sm font-bold text-[#0E1F2F] tracking-tight leading-none flex items-center">
                                {user?.name || 'Himani Sharma'}
                            </span>

                            {/* Refined Minimalist Corporate Role Tag - Font weight locked to black */}
                            <span className="bg-white text-slate-500 border border-slate-200/60 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md select-none flex items-center leading-none">
                                {user?.role || 'Admin'}
                            </span>
                        </div>

                    </div>

                    {/* Muted Premium Utilities Link Action - Font weight locked to bold */}
                    <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-500 text-sm font-bold transition-colors cursor-pointer flex items-center px-1"
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

                {/* Royal Dark Navy Sidebar */}
                <aside className={`
          fixed md:static inset-y-0 left-0 w-64 bg-[#0E1F2F] z-40 
          h-full overflow-y-auto flex-shrink-0 transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
                    <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-6 pt-6 pb-3 select-none">
                        Menu Navigation
                    </div>

                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center transition-all duration-150 text-sm px-4 py-3 ${isActive(item.path)
                                        ? 'bg-white/10 text-white font-black border-l-4 border-[#86A8CF] rounded-r-xl rounded-l-none'
                                        : 'text-slate-400 font-bold rounded-xl hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Workspace Canvas Panel - Explicit height restriction to purge double scrollbars */}
                <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-6 md:p-8 bg-[#F8FAFC]">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Layout;