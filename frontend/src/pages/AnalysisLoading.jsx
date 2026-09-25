import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AnalysisLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    // Mock analysis delay
    const timer = setTimeout(() => {
      navigate('/result');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="main-content" style={{ minHeight: '60vh', alignItems: 'center' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          border: '6px solid rgba(255,255,255,0.1)', 
          borderTopColor: 'var(--primary-color)', 
          borderRadius: '50%', 
          margin: '0 auto 2rem auto',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2>Analyzing Recording...</h2>
        <p>Extracting facial features and audio properties.</p>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Please wait while the AI processes your data.</p>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default AnalysisLoading;
