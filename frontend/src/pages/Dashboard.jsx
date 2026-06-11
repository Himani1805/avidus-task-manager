import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data || []);
    } catch (err) {
      setError('Failed to fetch tasks stream from backend instance.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/tasks', { title, description });
      setTasks((prevTasks) => [response.data, ...prevTasks]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit task data package.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const response = await api.put(`/tasks/${id}`, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? response.data : task))
      );
    } catch (err) {
      setError('Failed to change workflow milestone status.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to execute secure deletion sequence.');
    }
  };

  const renderTasksContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-white border border-slate-200/60 rounded-xl animate-pulse shadow-xs" />
          ))}
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-white rounded-xl p-16 text-center shadow-xs">
          <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 text-xs font-semibold mb-4">✓</div>
          <h3 className="text-xs font-semibold text-slate-900 tracking-tight">Workspace Clear</h3>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] leading-relaxed">No tasks pending for assignment execution. Add objectives via the panel input wrapper.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-start justify-between bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="space-y-1.5 pr-6">
              <h4 className={`text-xs font-semibold tracking-tight transition-all duration-200 ${
                task.status === 'Completed' ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
              }`}>
                {task.title}
              </h4>
              {task.description && (
                <p className={`text-[11px] leading-relaxed transition-all duration-200 ${
                  task.status === 'Completed' ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleToggleStatus(task._id, task.status)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all duration-150 cursor-pointer select-none uppercase border ${
                  task.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                    : 'bg-amber-50 text-amber-700 border-amber-200/50 hover:bg-amber-100'
                }`}
              >
                {task.status}
              </button>

              <button
                onClick={() => handleDeleteTask(task._id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50/60 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                title="Purge task"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-8">
      {error && (
        <div className="col-span-3 rounded-xl bg-red-50/70 border border-red-100 p-4 text-xs font-semibold text-red-600 shadow-xs">
          {error}
        </div>
      )}

      <div className="md:col-span-1">
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Create Task</h3>
            <p className="text-[11px] text-slate-500 mt-1">Populate the current queue with discrete objectives.</p>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Database interface mapping..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 shadow-xs transition-all outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-500/5"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide precise execution details..."
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-zinc-900 placeholder-slate-400 shadow-xs transition-all outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-500/5 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#1E293B] hover:bg-[#0F172A] py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-500/20 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Syncing...' : 'Add Objective'}
            </button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Active Workspace Stream <span className="ml-1.5 text-xs font-medium text-slate-400 normal-case">({tasks.length} entries)</span>
          </h2>
        </div>

        {renderTasksContent()}
      </div>
    </div>
  );
};

export default Dashboard;