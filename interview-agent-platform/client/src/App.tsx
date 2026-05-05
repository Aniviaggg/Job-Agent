import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobPostingsPage } from './pages/JobPostingsPage';
import { ResumesPage } from './pages/ResumesPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { CareerPlanPage } from './pages/CareerPlanPage';
import { AppLayout } from './components/AppLayout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes with layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="job-postings" element={<JobPostingsPage />} />
          <Route path="resumes" element={<ResumesPage />} />
          <Route path="interview-prep" element={<InterviewPrepPage />} />
          <Route path="mock-interview" element={<MockInterviewPage />} />
          <Route path="career-plan" element={<CareerPlanPage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
