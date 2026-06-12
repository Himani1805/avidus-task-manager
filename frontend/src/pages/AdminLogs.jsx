import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/logs');
        setLogs(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to pull system event streams.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionStyles = (action) => {
    const act = action?.toUpperCase() || '';
    if (act.includes('LOGIN')) {
      return 'bg-[#86A8CF] text-white border-[#86A8CF] shadow-xs';
    }
    if (act.includes('DELETE') || act.includes('PURGE')) {
      return 'bg-red-600 text-white border-red-600 shadow-xs';
    }
    if (act.includes('CREATE')) {
      return 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
    }
    return 'bg-[#C38EB4] text-white border-[#C38EB4] shadow-xs';
  };

  const resolveUsername = (log) => {
    return (
      log.userName ||
      log.username ||
      log.user?.name ||
      log.userId?.name ||
      log.userEmail ||
      log.email ||
      log.user_id ||
      'Unknown Operator'
    );
  };

  return (
    <div className="space-y-6 px-2 animate-fadeIn w-full max-w-full box-border overflow-x-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0E1F2F] tracking-tight">Activity Logs</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Track user actions, login activity, and system events.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border-2 border-red-100 p-4 text-xs font-bold text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {/* --- MOBILE/TABLET CARD LIST --- */}
      <div className="block lg:hidden space-y-4 w-full">
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded-md w-2/3" />
              <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 text-center text-slate-400 font-bold text-xs">
            No operations indexed.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log._id || log.id} className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#86A8CF] transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-[#0E1F2F] text-sm truncate max-w-[60%]" title={resolveUsername(log)}>
                  {resolveUsername(log)}
                </div>
                <span className={`px-2.5 py-0.5 rounded-xl text-[9px] font-black tracking-widest uppercase border border-transparent shrink-0 ${getActionStyles(log.action)}`}>
                  {log.action || 'SYSTEM_OP'}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-xs pt-1 border-t border-slate-50">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">IP Node:</span>
                  <span className="text-slate-600 font-mono font-medium">{log.ipAddress || log.ip_address || '127.0.0.1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Timestamp:</span>
                  <span className="text-slate-500 font-bold">
                    {log.createdAt || log.timestamp ? new Date(log.createdAt || log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- DESKTOP TABLE LAYOUT CONTAINER --- */}
      <div className="hidden lg:block bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          {/* 🌟 FIXED SCROLL JUGAD: Reduced min-w to 600px and added table-auto for flexible cell sizing */}
          <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-full table-auto">
            <thead>
              <tr className="bg-[#0E1F2F] border-b border-[#0E1F2F]">
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5">Username</th>
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-44">Action Descriptor</th>
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-36">IP Address</th>
                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-52">Logged Timestamp</th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-slate-50 text-sm font-medium text-slate-700">
              {isLoading ? (
                [1, 2, 3, 4].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-3 bg-slate-100 rounded-md w-3/4" /></td>
                    <td className="px-6 py-5"><div className="h-5 bg-slate-100 rounded-lg w-1/2" /></td>
                    <td className="px-6 py-5"><div className="h-3 bg-slate-100 rounded-md w-2/3" /></td>
                    <td className="px-6 py-5"><div className="h-3 bg-slate-100 rounded-md w-3/4" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-16 text-slate-400 font-bold text-xs">
                    No operations currently indexed into system stream registers.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                    <td className="px-6 py-5 font-bold text-[#0E1F2F] truncate max-w-[180px]" title={resolveUsername(log)}>
                      {resolveUsername(log)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border border-transparent ${getActionStyles(log.action)}`}>
                        {log.action || 'SYSTEM_OP'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-600 font-mono tracking-tight text-xs">
                      {log.ipAddress || log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-semibold truncate max-w-[200px]">
                      {log.createdAt || log.timestamp ? new Date(log.createdAt || log.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;