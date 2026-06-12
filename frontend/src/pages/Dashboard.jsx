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

  // ROLE CHECK LAW: Verify logged-in user credentials from local storage
  const userString = localStorage.getItem('user'); 
  const currentUser = userString ? JSON.parse(userString) : null;
  const isAdmin = currentUser?.role === 'Admin'; 

  // 1. READ: Fetch tasks from the backend infrastructure
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

  // 2. CREATE: Submit and append a newly initialized task item (Users Only)
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

  // 3. EDIT TRIGGER: Instantiate target task modification sub-state (Users Only)
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

  // 4. UPDATE CORE: Save refined task fields into database records (Users Only)
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

  // 5. UPDATE STATUS: Quick patch workflow toggle (Users Only)
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

  // 6. DELETE PURGE: Drop selected record identifier permanently (Available for both)
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task permanently?")) return;
    try {
      setError('');
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError('Failed to execute secure deletion sequence.');
    }
  };

  // Safe username parsing helper from populated object schema
  const resolveOwner = (task) => {
    if (task.createdBy && typeof task.createdBy === 'object') {
      return task.createdBy.name || task.createdBy.email || 'System Identity';
    }
    return task.userName || task.user_id || 'Unknown User';
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
          <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">No active tasks logged in your stream queue layout.</p>
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
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none bg-white focus:border-[#26425A] font-semibold"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none bg-white focus:border-[#26425A] resize-none"
                />
                <div className="flex justify-end gap-3 text-xs">
                  <button onClick={cancelEdit} className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition-all cursor-pointer">Cancel</button>
                  <button onClick={() => handleUpdateTask(task._id, task.status)} className="px-4 py-2 rounded-xl bg-[#26425A] text-white hover:bg-[#0E1F2F] font-bold shadow-sm transition-all cursor-pointer">Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className={`font-bold tracking-tight transition-all duration-200 text-base lg:text-lg ${
                      task.status === 'Completed' ? 'line-through text-slate-400 font-medium' : 'text-[#0E1F2F]'
                    }`}>
                      {task.title}
                    </h4>
                    {/* Admin only sees status badge, user can click to change it */}
                    {isAdmin && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                        task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-amber-50 text-amber-700 border-amber-200/50'
                      }`}>
                        {task.status || 'PENDING'}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className={`text-sm leading-relaxed transition-all duration-200 font-medium ${
                      task.status === 'Completed' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  {isAdmin && (
                    <div className="text-xs font-semibold text-slate-400 pt-1">
                      Task Owner: <span className="text-[#0E1F2F] font-bold bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">{resolveOwner(task)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0 pt-1 border-t sm:border-t-0 border-slate-100">
                  {/* Render actionable controls for normal users, only delete button for admin */}
                  {!isAdmin ? (
                    <>
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest border-2 transition-all duration-200 uppercase cursor-pointer select-none shadow-xs ${
                          task.status === 'Completed'
                            ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                            : 'bg-[#C38EB4] text-white border-[#C38EB4] hover:bg-[#b57ca5]'
                        }`}
                      >
                        {task.status}
                      </button>

                      <button onClick={() => startEdit(task)} className="p-2 rounded-xl text-slate-400 hover:text-[#26425A] hover:bg-[#86A8CF]/10 transition-all cursor-pointer border border-transparent" title="Modify text">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>

                      <button onClick={() => handleDeleteTask(task._id)} className="p-2 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-all cursor-pointer border border-transparent" title="Purge Objective">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl border border-transparent hover:border-red-200 transition-all cursor-pointer"
                    >
                      Delete Task
                    </button>
                  )}
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

      {/* Hide task registration panel if current identity is an Admin */}
      {!isAdmin && (
        <div className="lg:col-span-4">
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-[#0E1F2F] uppercase tracking-wide">Create Task</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Populate the current queue with discrete objectives.</p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-[#26425A] uppercase tracking-wider mb-2">Objective Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Database interface mapping..." className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium transition-all outline-none focus:border-[#26425A]" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#26425A] uppercase tracking-wider mb-2">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide precise execution details..." rows={5} className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium transition-all outline-none focus:border-[#26425A] resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-[#0E1F2F] py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#26425A] disabled:bg-slate-300 cursor-pointer tracking-wide">
                {isSubmitting ? 'Syncing...' : 'Add Objective'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stretch container width dynamically depending on the current user role structure */}
      <div className={isAdmin ? "col-span-12 space-y-5" : "lg:col-span-8 space-y-5"}>
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <h1 className="text-2xl font-black text-[#0E1F2F] tracking-tight">
            Active Workspace Stream <span className="ml-1.5 text-sm font-bold text-[#86A8CF] normal-case">({tasks.length} entries)</span>
          </h1>
        </div>
        {renderTasksContent()}
      </div>
    </div>
  );
};

export default Dashboard;