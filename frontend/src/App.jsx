import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDashboard from './pages/Dashboard';

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

          {/* Protected Routes Wrapper (Using the high-end Layout directly) */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
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