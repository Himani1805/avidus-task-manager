import { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/users');
        setUsers(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to pull authenticated identity registries.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/admin/users/${userId}/status`, { status: nextStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: nextStatus } : u));
    } catch (err) {
      setError('Failed to toggle target profile operational status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Permanently purge this user identity from cluster records?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError('Secure profile deletion sequence rejected by core server.');
    }
  };

  const isMobileOrTablet = windowWidth < 1024;

  return (
    <div className="space-y-8 px-2 animate-fadeIn w-full max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-black text-[#0E1F2F] tracking-tight">User Management</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage users, change status, and remove accounts when needed.</p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border-2 border-red-100 p-4 text-xs font-bold text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {isMobileOrTablet ? (
        /* Responsive Card Layout for Mobile and Tablets */
        <div className="space-y-4 w-full">
          {isLoading ? (
            [1, 2].map((n) => (
              <div key={n} className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-3 animate-pulse" />
            ))
          ) : users.length === 0 ? (
            <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 text-center text-slate-400 font-bold text-xs">No users found.</div>
          ) : (
            users.map(u => (
              <div key={u._id} className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#86A8CF] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-black text-[#0E1F2F] text-sm truncate max-w-[180px]">{u.name || 'System Operator'}</div>
                    <div className="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">{u.email}</div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(u._id, u.status || 'Active')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border cursor-pointer shrink-0 ${(u.status || 'Active') === 'Active' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                  >
                    {u.status || 'Active'}
                  </button>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-400 font-black uppercase text-[9px]">Authorization Level:</span>
                  <span className="bg-slate-100 text-slate-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-slate-200">{u.role || 'User'}</span>
                  <button onClick={() => handleDeleteUser(u._id)} className="text-[11px] font-black text-red-500 hover:text-white hover:bg-red-600 px-3 py-1 rounded-lg transition-all cursor-pointer">
                    Delete Account
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* High-Contrast Table Layout for Desktop Screens */
        <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden w-full">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#0E1F2F] border-b border-[#0E1F2F]">
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5">Username</th>
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-44 text-center">Role</th>
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-40 text-center">Status</th>
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-44 text-center">Actions Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50 text-sm font-medium text-slate-700">
              {isLoading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse"><td colSpan="4" className="px-6 py-5"><div className="h-4 bg-slate-100 rounded-md w-full" /></td></tr>
                ))
              ) : (
                users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors duration-150">
                    <td className="px-6 py-5">
                      <div className="font-black text-[#0E1F2F] text-base">{u.name || 'Unknown Operator'}</div>
                      <div className="text-xs text-slate-400 font-medium">{u.email}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md">
                        {u.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleToggleStatus(u._id, u.status || 'Active')}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${(u.status || 'Active') === 'Active' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-red-600 text-white border-red-600 shadow-sm'
                          }`}
                      >
                        {u.status || 'Active'}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button onClick={() => handleDeleteUser(u._id)} className="text-xs font-black text-red-500 hover:text-white bg-red-50 hover:bg-red-600 px-4 py-2 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-200">
                        Delete Account
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;