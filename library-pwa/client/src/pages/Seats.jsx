import { useState, useEffect } from 'react';

const Seats = ({ user }) => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/seats')
      .then(res => res.json())
      .then(data => setSeats(data))
      .catch(err => console.error(err));
  }, []);

  const handleBook = (seatNumber, shift) => {
    fetch('http://localhost:5000/api/seats/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seat_number: seatNumber, shift: shift })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`Seat ${seatNumber} booked for ${shift} shift!`);
        // Optimistic UI update
        setSeats(seats.map(s => s.seat_number === seatNumber ? { ...s, status: 'booked', shift } : s));
      } else {
        alert(data.message || 'Error booking seat');
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6">Reading Seat Booking</h1>
      <p className="mb-6 text-muted">Select an available seat to book it for the morning or evening shift.</p>
      
      <div className="card mb-8">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2"><div style={{width:'16px', height:'16px', background:'var(--surface)', border:'2px solid var(--primary)', borderRadius:'4px'}}></div> Available</div>
          <div className="flex items-center gap-2"><div style={{width:'16px', height:'16px', background:'var(--primary)', borderRadius:'4px'}}></div> Booked</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '1.5rem'
      }}>
        {seats.map(seat => (
          <div 
            key={seat.id} 
            className="card" 
            style={{ 
              textAlign: 'center', 
              padding: '1.5rem 1rem',
              background: seat.status === 'available' ? 'var(--surface)' : 'var(--primary)',
              color: seat.status === 'available' ? 'var(--text-main)' : 'white',
              border: `2px solid var(--primary)`,
              cursor: seat.status === 'available' ? 'pointer' : 'default',
              boxShadow: seat.status === 'available' ? 'var(--shadow-sm)' : 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{seat.seat_number}</h2>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase' }}>
              {seat.status}
            </p>
            {seat.status === 'booked' && seat.shift && (
             <p style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>{seat.shift}</p> 
            )}

            {seat.status === 'available' && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'rgba(255,255,255,0.95)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  borderRadius: 'calc(var(--radius) - 2px)' // adjust for border
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '80%'}}>
                  <button className="btn btn-primary" style={{padding: '0.25rem', fontSize: '0.75rem'}} onClick={() => handleBook(seat.seat_number, 'morning')}>Morning</button>
                  <button className="btn btn-secondary" style={{padding: '0.25rem', fontSize: '0.75rem'}} onClick={() => handleBook(seat.seat_number, 'evening')}>Evening</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seats;
