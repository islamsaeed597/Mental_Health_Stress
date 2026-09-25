import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('aura_history') || '[]');
    setHistory(savedHistory);
  }, []);

  return (
    <div className="main-content">
      <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Your History</h2>
          <Link to="/dashboard" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>&larr; Back</Link>
        </div>

        <div style={{ textAlign: 'left' }}>
          {history.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No assessments recorded yet. Take a test to see your history!</p>
          ) : (
            history.map((item) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '1.5rem', 
                background: 'rgba(0,0,0,0.2)', 
                borderRadius: '8px',
                marginBottom: '1rem',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: 0 }}>{item.date}</h4>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Category: {item.category}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {item.score}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
