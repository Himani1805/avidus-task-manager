import { useState, useEffect } from 'react';
import api from '../services/api';

const TaskMonitoring = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const fetchAllTasks = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/tasks'); // Admin access naturally pulls the entire database task collection
                setTasks(response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to pull global objective vectors.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllTasks();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAdminDeleteTask = async (taskId) => {
        if (!window.confirm("Administrative override: Force purge this objective structure from active streams?")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(t => t._id !== taskId));
        } catch (err) {
            setError('Core framework rejected administrative erasure request.');
        }
    };

    const isMobileOrTablet = windowWidth < 1024;

    return (
        <div className="space-y-8 px-2 animate-fadeIn w-full max-w-full overflow-x-hidden">
            <div>
                <h1 className="text-2xl font-black text-[#0E1F2F] tracking-tight">Global Task Monitoring</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Intercept, monitor progress flags, and apply administrative overrides across distributed milestones.</p>
            </div>

            {error && (
                <div className="rounded-2xl bg-red-50 border-2 border-red-100 p-4 text-xs font-bold text-red-600 shadow-sm">
                    {error}
                </div>
            )}

            {isMobileOrTablet ? (
                /* Mobile/Tablet Card Stack view */
                <div className="space-y-4 w-full">
                    {isLoading ? (
                        [1, 2].map((n) => <div key={n} className="bg-white border-2 border-slate-100 rounded-2xl p-5 h-32 animate-pulse" />)
                    ) : tasks.length === 0 ? (
                        <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 text-center text-slate-400 font-bold text-xs">No active tasks logged in the system.</div>
                    ) : (
                        tasks.map(t => (
                            <div key={t._id} className="bg-white border-2 border-slate-100 rounded-2xl p-5 space-y-3 shadow-xs hover:border-[#86A8CF] transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="font-black text-[#0E1F2F] text-sm truncate max-w-[180px]">{t.title}</div>
                                        <div className="text-[11px] text-slate-500 font-medium line-clamp-2 max-w-[180px] mt-0.5">{t.description || 'No description provided.'}</div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-xl text-[9px] font-black tracking-widest uppercase shrink-0 ${t.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-[#C38EB4] text-white'
                                        }`}>
                                        {t.status || 'PENDING'}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-medium">Owner: <span className="font-bold text-[#0E1F2F]">{t.userEmail || t.userName || 'System Assigned'}</span></span>
                                    <button onClick={() => handleAdminDeleteTask(t._id)} className="text-xs font-black text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-1 rounded-lg transition-all cursor-pointer">
                                        Erase Item
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Desktop Table view Grid */
                <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-sm overflow-hidden w-full">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                            <tr className="bg-[#0E1F2F] border-b border-[#0E1F2F]">
                                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5">Objective Structure</th>
                                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-56">Deployment Owner</th>
                                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-40 text-center">Milestone State</th>
                                <th className="text-xs font-black text-white uppercase tracking-widest px-6 py-4.5 w-40 text-center">Override Execution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-50 text-sm font-medium text-slate-700">
                            {isLoading ? (
                                [1, 2, 3].map((n) => (
                                    <tr key={n} className="animate-pulse"><td colSpan="4" className="px-6 py-5"><div className="h-4 bg-slate-100 rounded-md w-full" /></td></tr>
                                ))
                            ) : (
                                tasks.map(t => (
                                    <tr key={t._id} className="hover:bg-slate-50/70 transition-colors duration-150">
                                        <td className="px-6 py-5">
                                            <div className="font-black text-[#0E1F2F] text-base">{t.title}</div>
                                            <div className="text-xs text-slate-400 font-medium truncate max-w-sm">{t.description || 'No execution details package appended.'}</div>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-slate-600 truncate max-w-[180px]">
                                            {t.userEmail || t.userName || 'Root System Admin'}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-transparent shadow-xs ${t.status === 'Completed' ? 'bg-emerald-600 text-white shadow-emerald-600/10' : 'bg-[#C38EB4] text-white shadow-pink-500/10'
                                                }`}>
                                                {t.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => handleAdminDeleteTask(t._id)} className="text-xs font-black text-red-500 hover:text-white bg-red-50 hover:bg-red-600 px-4 py-2 rounded-xl transition-all cursor-pointer">
                                                Erase Objective
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

export default TaskMonitoring;