import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { removeToken } from '../utils/token';
import './Navbar.css';

/**
 * Top navigation bar with app title and logout button.
 */
export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if backend fails, clear locally
    } finally {
      removeToken();
      navigate('/login');
    }
  };

  // Don't show navbar on auth pages
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (authPaths.includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">📝</span>
        <Link to="/dashboard" className="navbar-title">Fundoo Notes</Link>
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search notes..."
          className="search-input"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <button className="navbar-logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
