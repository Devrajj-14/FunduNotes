import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/token';

/**
 * Protected route wrapper.
 * Redirects to /login if no token is present.
 */
export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
