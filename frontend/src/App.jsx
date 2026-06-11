import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDashboard from './pages/Dashboard';


// Layout wrapper to include Navbar on protected pages cleanly
const AppLayout = () => (
  <div className="min-h-screen bg-zinc-50/50">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);

// Temporary components placeholder (Replace these with your actual pages later)
const AdminLogs = () => <div className="p-8 text-sm text-zinc-800 font-medium">Admin Activity Logs System</div>;
const AdminAnalytics = () => <div className="p-8 text-sm text-zinc-800 font-medium">Admin Analytics Dashboard Overview</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Wrapper */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* User Dashboard / My Tasks */}
            <Route path="/" element={<TaskDashboard />} />

            {/* Admin Only Exclusive Routes */}
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;