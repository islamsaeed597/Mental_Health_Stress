import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <>
      <header className="header" style={{ marginBottom: '2rem' }}>
        <h2>Welcome back, Student</h2>
        <p>Ready for your daily check-in?</p>
      </header>
      
      <main className="main-content">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3>New Stress Test</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Take a quick 30-second video assessment to estimate your current stress level based on voice and facial cues.
            </p>
            <Link to="/test" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Start Stress Test
            </Link>
          </div>
          
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <div>
            <h3>Your History</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Review your past results to track your estimated stress trends over time.
            </p>
            <Link to="/history" className="primary-btn" style={{ textDecoration: 'none', background: 'var(--card-bg)', display: 'inline-block' }}>
              View History
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
