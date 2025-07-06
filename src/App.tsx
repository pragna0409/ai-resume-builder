import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CursorTrail from './components/CursorTrail';
import InteractiveBackground from './components/InteractiveBackground';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import SkillTest from './pages/SkillTest';
import CareerPath from './pages/CareerPath';
import JobRecommendations from './pages/JobRecommendations';
import ViewProfile from './pages/ViewProfile';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <CursorTrail />
        <InteractiveBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/skill-test" element={<SkillTest />} />
          <Route path="/career-path" element={<CareerPath />} />
          <Route path="/jobs" element={<JobRecommendations />} />
          <Route path="/profile" element={<ViewProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;