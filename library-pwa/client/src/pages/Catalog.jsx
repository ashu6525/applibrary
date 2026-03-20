import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const Catalog = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', 'History', 'Science', 'Novels', 'Competitive Exams', 'Magazines'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleReserve = (bookId) => {
    fetch(`http://localhost:5000/api/books/${bookId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'reserved' })
    }).then(res => res.json()).then(data => {
      if(data.success) {
        setBooks(books.map(b => b.id === bookId ? { ...b, status: 'reserved' } : b));
        alert('Book reserved successfully! Admin notified.');
      }
    });
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6">Book Catalog</h1>
      
      {/* Search and Filter */}
      <div className="card mb-8">
        <div className="flex gap-4 flex-wrap items-center">
          <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'var(--background)', borderRadius: '8px', padding: '0 1rem', border: '1px solid var(--border)' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: '0.75rem', width: '100%', outline: 'none', color: 'var(--text-main)' }}
            />
          </div>
          
          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)}
            className="form-input"
            style={{ flex: '0 0 auto', width: 'auto'}}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? filteredBooks.map(book => (
          <div key={book.id} className="card flex flex-col justify-between" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '200px', backgroundColor: '#e2e8f0', backgroundImage: `url(${book.cover_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <span className={`badge mb-2 
                  ${book.status === 'available' ? 'badge-success' : 
                    book.status === 'reserved' ? 'badge-warning' : 'badge-danger'}`}
                >
                  {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </span>
                <h3 style={{ marginBottom: '0.25rem' }}>{book.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>By {book.author}</p>
                <p className="mt-2" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary)' }}>{book.category}</p>
              </div>
              
              <button 
                className={`btn mt-4 w-full ${book.status === 'available' ? 'btn-primary' : 'btn-outline'}`}
                disabled={book.status !== 'available'}
                onClick={() => handleReserve(book.id)}
                style={{ width: '100%' }}
              >
                {book.status === 'available' ? 'Reserve Book' : 'Not Available'}
              </button>
            </div>
          </div>
        )) : (
          <p className="text-muted col-span-full text-center py-12">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
