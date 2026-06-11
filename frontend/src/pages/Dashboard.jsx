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
      setError('Failed to load tasks. Please try again.');
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
      setError(err.response?.data?.message || 'Failed to create task');
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
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const renderTasksContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-zinc-100/60 rounded-xl border border-zinc-100 animate-pulse" />
          ))}
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-xl p-12 bg-white text-center">
          <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100 text-xs font-semibold mb-3">✓</div>
          <p className="text-xs font-medium text-zinc-800">No tasks added yet</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Your clear overview will materialize once you add tasks.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-start justify-between bg-white border border-zinc-100 rounded-xl p-4 shadow-sm hover:border-zinc-200 transition-all group"
          >
            <div className="space-y-1 pr-4">
              <h4 className={`text-xs font-semibold tracking-tight transition-all ${
                task.status === 'Completed' ? 'line-through text-zinc-400 font-normal' : 'text-zinc-800'
              }`}>
                {task.title}
              </h4>
              {task.description && (
                <p className={`text-[11px] leading-relaxed ${
                  task.status === 'Completed' ? 'text-zinc-300' : 'text-zinc-500'
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleToggleStatus(task._id, task.status)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border transition-all cursor-pointer select-none uppercase ${
                  task.status === 'Completed'
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600'
                    : 'bg-amber-50/50 border-amber-100 text-amber-600 hover:bg-amber-100/50'
                }`}
              >
                {task.status}
              </button>

              <button
                onClick={() => handleDeleteTask(task._id)}
                className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Delete task"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="col-span-3 rounded-lg bg-red-50 border border-red-100 p-3 text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="md:col-span-1">
        <div className="sticky top-20 bg-white border border-zinc-100 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">Create workspace task</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Add actionable objectives to your list.</p>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Finish interface optimization..."
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 shadow-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add contextual details here..."
                rows={4}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 shadow-sm transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-zinc-900 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:bg-zinc-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Creating task...' : 'Add Task'}
            </button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">
            My Tasks <span className="ml-1 text-xs font-normal text-zinc-400">({tasks.length})</span>
          </h2>
        </div>

        {renderTasksContent()}
      </div>
    </div>
  );
};

export default Dashboard;