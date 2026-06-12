import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDashboard from './pages/Dashboard';
import AdminLogs from './pages/AdminLogs';
import AdminAnalytics from './pages/AdminAnalytics';
import UserManagement from './pages/UserManagement';
import TaskMonitoring from './pages/TaskMonitoring';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Main Workspace Shell */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* User Dashboard / My Tasks */}
            <Route path="/" element={<TaskDashboard />} />

            {/*Fully Protected Admin Only Exclusive Routes */}
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
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <ProtectedRoute adminOnly={true}>
                  <TaskMonitoring />
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