import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Premium Circular Progress Component
const CircularProgress = ({ value, size = 140, color = "#0ea5e9", label }) => {
  const radius = size * 0.35;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    // Animate on load
    setTimeout(() => {
      setOffset(circumference - (value / 100) * circumference);
    }, 100);
  }, [value, circumference]);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle 
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"
          />
          {/* Progress circle */}
          <circle 
            cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{Math.round(value)}</span>
        </div>
      </div>
      <span style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{label}</span>
    </div>
  );
};

function Result() {
  const location = useLocation();
  
  const resultData = location.state?.results || {
    audioScore: 42,
    faceScore: 21,
    finalScore: 31.5,
    category: "Low"
  };

  useEffect(() => {
    if (resultData) {
      const history = JSON.parse(localStorage.getItem('aura_history') || '[]');
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        score: Math.round(resultData.finalScore),
        category: resultData.category,
        audioScore: resultData.audioScore,
        faceScore: resultData.faceScore
      };
      
      // Prevent duplicate saving on React strict mode double re-renders
      const lastEntry = history[0];
      if (!lastEntry || lastEntry.score !== newEntry.score || (Date.now() - lastEntry.id > 2000)) {
        history.unshift(newEntry);
        localStorage.setItem('aura_history', JSON.stringify(history));
      }
    }
  }, [resultData]);

  const getCategoryConfig = (category) => {
    if (category === "High") return { color: "#ef4444", text: "Elevated Cognitive Load", bg: "rgba(239, 68, 68, 0.1)" };
    if (category === "Medium") return { color: "#f59e0b", text: "Moderate Activity", bg: "rgba(245, 158, 11, 0.1)" };
    return { color: "#10b981", text: "Optimal Baseline", bg: "rgba(16, 185, 129, 0.1)" };
  };

  const config = getCategoryConfig(resultData.category);

  const getRecommendations = (category) => {
    if (category === "High") {
      return [
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>, 
          title: "The Physiological Sigh", 
          desc: "Take 2 quick inhales through the nose, followed by a long exhale through the mouth. Repeat 3 times to rapidly reduce autonomic arousal." 
        },
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"></path><path strokeLinecap="round" strokeLinejoin="round" d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path strokeLinecap="round" strokeLinejoin="round" d="M18 12a2 2 0 00-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>, 
          title: "Vagus Nerve Stimulation", 
          desc: "Splash cold water on your face or drink ice water. This triggers the mammalian dive reflex, instantly lowering your heart rate." 
        },
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>, 
          title: "Sensory Grounding (5-4-3-2-1)", 
          desc: "Interrupt acute anxiety by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste." 
        }
      ];
    } else if (category === "Medium") {
      return [
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>, 
          title: "Cognitive Offloading", 
          desc: "Your working memory is nearing capacity. Do a 'brain dump'—write down your next 3 tasks to instantly reduce mental load." 
        },
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>, 
          title: "Attention Restoration", 
          desc: "Step away from screens and look at a natural environment (like trees or the sky) for 5 minutes to restore directed attention." 
        },
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
          title: "Bilateral Stimulation", 
          desc: "Take a short walk. The rhythmic left-right movement helps your brain process and discharge moderate emotional load." 
        }
      ];
    } else {
      return [
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>, 
          title: "Flow State Ready", 
          desc: "Your cognitive load is optimal. Block distractions for the next 90 minutes to engage in deep, uninterrupted work." 
        },
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>, 
          title: "Neuroplasticity Window", 
          desc: "Low stress means cortisol isn't inhibiting your hippocampus. This is the absolute best time to learn complex, new information." 
        },
        { 
          icon: <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>, 
          title: "Baseline Maintenance", 
          desc: "To preserve this excellent baseline, ensure you maintain your current sleep architecture (7-8 hours) tonight." 
        }
      ];
    }
  };

  const recommendations = getRecommendations(resultData.category);

  return (
    <div className="main-content" style={{ padding: '2rem 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '900px', padding: '3rem' }}>
        
        {/* Header section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Aura Assessment Complete
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Your real-time cognitive and physiological analysis is ready.</p>
        </div>
        
        {/* Main Scores Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <CircularProgress value={resultData.faceScore} size={130} color="#8b5cf6" label="Visual Stress" />
          </div>

          {/* Center (Final Score) is larger */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: config.bg, borderRadius: '24px', border: `1px solid ${config.color}30`, position: 'relative', transform: 'scale(1.05)', zIndex: 2, boxShadow: `0 0 30px ${config.color}20` }}>
            <CircularProgress value={resultData.finalScore} size={180} color={config.color} label="Overall Index" />
            <div style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', background: `${config.color}20`, color: config.color, borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px' }}>
              {config.text}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <CircularProgress value={resultData.audioScore} size={130} color="#0ea5e9" label="Vocal Tension" />
          </div>

        </div>

        {/* Actionable Insights Section */}
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#f8fafc', fontWeight: 600 }}>Actionable Insights</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {recommendations.map((rec, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'transform 0.3s ease' }}>
                <span style={{ fontSize: '2rem', background: 'rgba(255,255,255,0.05)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                  {rec.icon}
                </span>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.3rem', fontWeight: 600 }}>{rec.title}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/dashboard" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-flex', padding: '1rem 3rem' }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Result;
