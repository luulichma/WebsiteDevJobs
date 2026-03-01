import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchJobsPage from './pages/SearchJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import ApplicationHistoryPage from './pages/ApplicationHistoryPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import PostJobPage from './pages/PostJobPage';
import ManageApplicationsPage from './pages/ManageApplicationsPage';
import ManageJobsPage from './pages/ManageJobsPage';
import AdminApproveJobsPage from './pages/AdminApproveJobsPage';
import AdminManageUsersPage from './pages/AdminManageUsersPage';

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<SearchJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Candidate Routes */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/applications" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <ApplicationHistoryPage />
          </ProtectedRoute>
        } />

        {/* Recruiter Routes */}
        <Route path="/recruiter/company" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <CompanyProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/post-job" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <PostJobPage />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/applications" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <ManageApplicationsPage />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/jobs" element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <ManageJobsPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/approve" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApproveJobsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageUsersPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
