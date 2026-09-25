import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="hero-section">
      <div className="hero-text">
        <h1>
          Master Your <br/>
          <span>Cognitive State.</span>
        </h1>
        <p>
          Aura is the world's most advanced real-time cognitive assessment platform. 
          Using advanced visual and auditory analysis, we provide instant, private insights 
          into your emotional well-being and stress levels.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
          <Link to="/test" className="primary-btn">
            Try Guest Assessment
          </Link>
          <Link to="/register" className="secondary-btn">
            Create Free Account
          </Link>
        </div>
        
        <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
          <div>
            <strong style={{ color: '#fff', fontSize: '1.5rem', display: 'block', marginBottom: '0.2rem' }}>468</strong>
            <span>Tracking Points</span>
          </div>
          <div>
            <strong style={{ color: '#fff', fontSize: '1.5rem', display: 'block', marginBottom: '0.2rem' }}>&lt; 1s</strong>
            <span>Processing Time</span>
          </div>
          <div>
            <strong style={{ color: '#fff', fontSize: '1.5rem', display: 'block', marginBottom: '0.2rem' }}>100%</strong>
            <span>Privacy Guarded</span>
          </div>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="glass-box">
          {/* Abstract representation of the AI scanner */}
          <svg width="60%" height="60%" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 20px rgba(14,165,233,0.5))' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="var(--primary-color)" strokeWidth="1" strokeDasharray="5,5">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="25" fill="none" stroke="var(--accent-color)" strokeWidth="2">
               <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="15s" repeatCount="indefinite" />
            </circle>
            <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="50" cy="50" r="4" fill="#fff" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
