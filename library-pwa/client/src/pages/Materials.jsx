import { useState, useEffect } from 'react';
import { Download, FileText, BookOpen } from 'lucide-react';

const Materials = ({ user }) => {
  const [materials, setMaterials] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/materials')
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(err => console.error(err));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={24} color="var(--primary)" />;
      case 'ebook': return <BookOpen size={24} color="var(--secondary)" />;
      default: return <FileText size={24} color="var(--primary)" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1>Study Materials</h1>
        {user.role === 'admin' && (
          <button className="btn btn-primary">Upload Material</button>
        )}
      </div>
      
      {materials.length === 0 ? (
        <div className="card text-center p-12">
          <BookOpen size={48} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
          <h3>No materials available yet.</h3>
          <p className="text-muted mt-2">Check back later for PDF notes and previous year question papers.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map(material => (
            <div key={material.id} className="card flex items-start gap-4">
              <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                {getIcon(material.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{material.title}</h3>
                <span className="badge badge-warning mb-2">{material.type.toUpperCase()}</span>
                <a 
                  href={material.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline"
                  style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Materials;
