import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Seats from './pages/Seats';
import Materials from './pages/Materials';
import Admin from './pages/Admin';

// Basic wrapper for layout (Sidebar + Top Navbar)
const AppLayout = ({ children, role, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Placeholder */}
      <aside 
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: sidebarOpen ? 0 : 'max(-var(--sidebar-width), -100%)',
          zIndex: 10,
          transition: 'left 0.3s ease',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h2 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>LibraryApp</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          <a href="/" style={{ color: 'var(--text-main)', fontWeight: 500 }}>Dashboard</a>
          <a href="/catalog" style={{ color: 'var(--text-main)', fontWeight: 500 }}>Book Catalog</a>
          <a href="/seats" style={{ color: 'var(--text-main)', fontWeight: 500 }}>Seat Booking</a>
          <a href="/materials" style={{ color: 'var(--text-main)', fontWeight: 500 }}>Study Materials</a>
          {role === 'admin' && (
            <a href="/admin" style={{ color: 'var(--danger)', fontWeight: 500 }}>Admin Panel</a>
          )}
        </nav>
        <button className="btn btn-outline" onClick={onLogout}>Logout</button>
      </aside>

      {/* Main Content Area */}
      <div className="main-content" style={{ marginLeft: window.innerWidth > 768 ? 'var(--sidebar-width)' : 0 }}>
        {/* Mobile Header */}
        <header style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--primary)' }}>LibraryApp</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-outline">Menu</button>
        </header>

        {children}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  // Placeholder for login status check
  useEffect(() => {
    const storedUser = localStorage.getItem('library_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('library_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('library_user');
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-6" style={{ color: 'var(--primary)' }}>LibraryApp Login</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            // Defaulting to member login for testing UI
            handleLogin({ id: 1, name: 'Test User', role: 'member' });
          }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" placeholder="e.g. 9876543210" />
            </div>
            <div className="form-group">
              <label className="form-label">Password/OTP</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
            <button 
              type="button" 
              className="btn btn-outline mt-2" 
              style={{ width: '100%' }}
              onClick={() => handleLogin({ id: 0, name: 'Admin', role: 'admin' })}
            >
              Login as Admin (Demo)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AppLayout role={user.role} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/catalog" element={<Catalog user={user} />} />
        <Route path="/seats" element={<Seats user={user} />} />
        <Route path="/materials" element={<Materials user={user} />} />
        
        {user.role === 'admin' && (
          <Route path="/admin" element={<Admin user={user} />} />
        )}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
