import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StressTest from './pages/StressTest';
import AnalysisLoading from './pages/AnalysisLoading';
import Result from './pages/Result';
import History from './pages/History';

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/register'].includes(location.pathname);
  
  return (
    <div className={`app-wrapper ${!isAuthPage ? 'has-sidebar' : ''}`}>
      {/* Animated Glow Orbs for Ultra-Premium feel */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {isAuthPage ? (
        // Minimalist Navbar for Landing Page
        <nav className="top-navbar">
          <div className="logo-container">
             <div className="logo-dot"></div>
             <span className="logo-text">AURA</span>
          </div>
        </nav>
      ) : (
        <Sidebar />
      )}

      <main className="page-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<StressTest />} />
          <Route path="/analyzing" element={<AnalysisLoading />} />
          <Route path="/result" element={<Result />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
