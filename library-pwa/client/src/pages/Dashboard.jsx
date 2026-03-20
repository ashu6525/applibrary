import { useState, useEffect } from 'react';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [liveSeats, setLiveSeats] = useState(null);
  
  useEffect(() => {
    // Fetch dashboard stats depending on role
    if (user.role === 'admin') {
      fetch('http://localhost:5000/api/dashboard/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }
    
    // Everyone sees live library status
    fetch('http://localhost:5000/api/dashboard/live')
        .then(res => res.json())
        .then(data => setLiveSeats(data))
        .catch(err => console.error(err));
  }, [user]);

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6">Welcome back, {user.name}</h1>
      
      {user.role === 'admin' && stats && (
        <>
          <h2 className="mb-4">Admin Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <h3>Total Members</h3>
              <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--primary)' }}>{stats.totalMembers}</p>
            </div>
            <div className="card">
              <h3>Active Members</h3>
              <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--secondary)' }}>{stats.activeMembers}</p>
            </div>
            <div className="card">
              <h3>Books Issued</h3>
              <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--warning)' }}>{stats.booksIssued}</p>
            </div>
            <div className="card">
              <h3>Monthly Revenue</h3>
              <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--success, #10B981)' }}>${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}

      {user.role === 'member' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3>My Issued Books</h3>
            <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--primary)' }}>0</p>
          </div>
          <div className="card">
            <h3>Seat Status</h3>
            <p className="mt-2 text-lg text-muted">No active booking</p>
          </div>
          <div className="card">
            <h3>Pending Fines</h3>
            <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--danger)' }}>$0.00</p>
          </div>
        </div>
      )}

      <h2 className="mb-4">Live Library Status (Bonus Feature)</h2>
      {liveSeats ? (
        <div className="card mb-8 p-6" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white' }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 style={{ color: 'rgba(255,255,255,0.8)' }}>Seats Available</h3>
              <p className="text-4xl font-bold mt-2">{liveSeats.availableSeats}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ color: 'rgba(255,255,255,0.8)' }}>Seats Occupied</h3>
              <p className="text-4xl font-bold mt-2">{liveSeats.occupiedSeats}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading live status...</p>
      )}
    </div>
  );
};

export default Dashboard;
