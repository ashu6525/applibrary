import { useState, useEffect } from 'react';

const Admin = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', message: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, []);

  const handleCreateNotice = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotice)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setNotifications([{ ...newNotice, id: data.id, date: new Date().toISOString() }, ...notifications]);
        setNewNotice({ title: '', message: '' });
        alert('Notification sent!');
      }
    });
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6" style={{ color: 'var(--danger)' }}>Admin Control Panel</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="mb-4">Quick Actions</h2>
          <div className="grid gap-4 mb-8">
            <button className="card btn btn-outline" style={{ display: 'block', width: '100%', textAlign: 'left' }}>
              <h3>Issue Book</h3>
              <p className="text-muted mt-1 font-normal">Process a new book issue for a member</p>
            </button>
            <button className="card btn btn-outline" style={{ display: 'block', width: '100%', textAlign: 'left' }}>
              <h3>Accept Return</h3>
              <p className="text-muted mt-1 font-normal">Process a book return and calculate fines</p>
            </button>
            <button className="card btn btn-outline" style={{ display: 'block', width: '100%', textAlign: 'left' }}>
              <h3>Mark Attendance</h3>
              <p className="text-muted mt-1 font-normal">Record daily attendance for members</p>
            </button>
            <button className="card btn btn-outline" style={{ display: 'block', width: '100%', textAlign: 'left' }}>
              <h3>Accept Fee Payment</h3>
              <p className="text-muted mt-1 font-normal">Log monthly membership fee via UPI/Cash</p>
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="mb-4">Send Broadcast Notification</h2>
          <form className="card mb-8" onSubmit={handleCreateNotice}>
            <div className="form-group">
              <label className="form-label">Notice Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Holiday Announcement" 
                value={newNotice.title}
                onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group mb-6">
              <label className="form-label">Message Content</label>
              <textarea 
                className="form-input" 
                rows="4" 
                placeholder="Details of the notification..."
                value={newNotice.message}
                onChange={e => setNewNotice({...newNotice, message: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Notification</button>
          </form>

          <h2 className="mb-4">Recent Notifications</h2>
          <div className="grid gap-4">
            {notifications.map(n => (
              <div key={n.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 style={{ fontWeight: 600 }}>{n.title}</h4>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
