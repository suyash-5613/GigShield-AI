import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BuyPolicy from './pages/BuyPolicy';
import Claims from './pages/Claims';
import AdminDashboard from './pages/AdminDashboard';
import SimulatorPanel from './pages/SimulatorPanel';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // If not logged in, show login page only
  if (!user) {
    return (
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="*" element={<Login onLogin={(u) => setUser(u)} />} />
          </Routes>
        </div>
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
              color: '#e2e8f0',
            },
          }}
        />
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex">
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content — shifted right by sidebar width */}
        <main className="flex-1 lg:ml-[240px] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  {user.role === 'admin' ? <Navigate to="/admin" replace /> : <Dashboard user={user} />}
                </ProtectedRoute>
              } />
              <Route path="/buy-policy" element={
                <ProtectedRoute><BuyPolicy user={user} /></ProtectedRoute>
              } />
              <Route path="/claims" element={
                <ProtectedRoute><Claims user={user} /></ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/simulator" element={<SimulatorPanel />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            color: '#e2e8f0',
          },
        }}
      />
    </Router>
  );
}

export default App;
