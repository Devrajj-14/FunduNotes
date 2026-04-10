import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ArchivePage from '../pages/ArchivePage';
import TrashPage from '../pages/TrashPage';
import ReminderPage from '../pages/ReminderPage';

/**
 * Application route configuration.
 * Public routes: login, register, forgot-password, reset-password
 * Protected routes: dashboard, archive, trash, reminders
 */
export default function AppRoutes({ searchQuery }) {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage searchQuery={searchQuery} /></ProtectedRoute>
      } />
      <Route path="/archive" element={
        <ProtectedRoute><ArchivePage searchQuery={searchQuery} /></ProtectedRoute>
      } />
      <Route path="/trash" element={
        <ProtectedRoute><TrashPage searchQuery={searchQuery} /></ProtectedRoute>
      } />
      <Route path="/reminders" element={
        <ProtectedRoute><ReminderPage /></ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
