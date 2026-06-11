import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- Inline Configuration Edit Panel States ---
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. READ: Synchronize client stream with database cluster on mount
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

  // 2. CREATE: Dispatch data payload to register a fresh task object
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

  // 3. EDIT TRIGGER: Toggle targeted card block into active modification state
  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // 4. UPDATE CORE: Save modified task strings via API PUT pipeline
  const handleUpdateTask = async (id, currentStatus) => {
    if (!editTitle.trim()) return;
    try {
      setError('');
      const response = await api.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        status: currentStatus
      });

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? response.data : t))
      );
      cancelEdit();
    } catch (err) {
      setError('Failed to update task configuration details.');
    }
  };

  // 5. UPDATE STATUS: Quick patch to alternate milestone completion flags
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      setError('');
      const response = await api.put(`/tasks/${task._id}`, { status: nextStatus });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? response.data : t))
      );
    } catch (err) {
      setError('Failed to change workflow status.');
    }
  };

  // 6. DELETE PURGE: Discard target task index permanently from state and db
  const handleDeleteTask = async (taskId) => {
    try {
      setError('');
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError('Failed to execute secure deletion sequence.');
    }
  };

  const renderTasksContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-white rounded-2xl p-16 text-center shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 text-sm font-bold mb-4">✓</div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Workspace Clear</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">No active tasks logged in your stream queue layout. Appending records will instantiate logging.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white border-2 border-slate-100/80 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.01)] transition-all duration-300 hover:border-[#86A8CF] hover:shadow-md group overflow-hidden"
          >
            {editingTaskId === task._id ? (
              <div className="p-5 space-y-4 bg-slate-50/50">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none bg-white focus:border-[#26425A] focus:ring-4 focus:ring-slate-500/5 transition-all font-semibold"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none bg-white focus:border-[#26425A] focus:ring-4 focus:ring-slate-500/5 transition-all resize-none"
                />
                <div className="flex justify-end gap-3 text-xs">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTask(task._id, task.status)}
                    className="px-4 py-2 rounded-xl bg-[#26425A] text-white hover:bg-[#0E1F2F] font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                
                {/* Content Area */}
                <div className="space-y-1.5 flex-1">
                  <h4 className={`font-bold tracking-tight transition-all duration-200 text-base lg:text-lg ${
                    task.status === 'Completed' ? 'line-through text-slate-400 font-medium' : 'text-[#0E1F2F]'
                  }`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className={`text-sm leading-relaxed transition-all duration-200 font-medium ${
                      task.status === 'Completed' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Actions Panel */}
                <div className="flex items-center justify-end gap-3 shrink-0 pt-1 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Vibrant Status Toggles using custom palette tones */}
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest border-2 transition-all duration-200 uppercase cursor-pointer select-none shadow-xs ${
                      task.status === 'Completed'
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-[0_2px_8px_rgba(16,185,129,0.2)]'
                        : 'bg-[#C38EB4] text-white border-[#C38EB4] hover:bg-[#b57ca5] shadow-[0_2px_8px_rgba(195,142,180,0.3)]'
                    }`}
                  >
                    {task.status}
                  </button>

                  {/* Modify Button with Slate-Blue Accent */}
                  <button
                    onClick={() => startEdit(task)}
                    className="p-2 rounded-xl text-slate-400 hover:text-[#26425A] hover:bg-[#86A8CF]/10 transition-all duration-150 cursor-pointer border border-transparent hover:border-[#86A8CF]/30"
                    title="Modify text"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete Button with Soft Tint Background */}
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="p-2 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-all duration-150 cursor-pointer border border-transparent hover:border-red-200"
                    title="Purge Objective"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-8 px-2">
      {error && (
        <div className="col-span-12 rounded-2xl bg-red-50 border-2 border-red-100 p-4 text-xs font-bold text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {/* LEFT COLUMN: Input Control Panel Box */}
      <div className="lg:col-span-4">
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-[#0E1F2F] uppercase tracking-wide">Create Task</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Populate the current queue with discrete objectives.</p>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-[#26425A] uppercase tracking-wider mb-2">Objective Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Database interface mapping..."
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium transition-all outline-none focus:border-[#26425A] focus:ring-4 focus:ring-slate-500/5"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#26425A] uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide precise execution details..."
                rows={5}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium transition-all outline-none focus:border-[#26425A] focus:ring-4 focus:ring-slate-500/5 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#0E1F2F] py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#26425A] focus:outline-none focus:ring-4 focus:ring-slate-500/10 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer tracking-wide"
            >
              {isSubmitting ? 'Syncing...' : 'Add Objective'}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Stream Dashboard Display Grid */}
      <div className="lg:col-span-8 space-y-5">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#0E1F2F]">
            Active Workspace Stream <span className="ml-1.5 text-xs font-bold text-[#86A8CF] normal-case">({tasks.length} entries)</span>
          </h2>
        </div>

        {renderTasksContent()}
      </div>
    </div>
  );
};

export default Dashboard;