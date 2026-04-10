import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar navigation for switching between views.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <span className="sidebar-icon">💡</span>
        <span>Notes</span>
      </NavLink>
      <NavLink to="/reminders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <span className="sidebar-icon">🔔</span>
        <span>Reminders</span>
      </NavLink>
      <NavLink to="/archive" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <span className="sidebar-icon">📦</span>
        <span>Archive</span>
      </NavLink>
      <NavLink to="/trash" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <span className="sidebar-icon">🗑️</span>
        <span>Trash</span>
      </NavLink>
    </aside>
  );
}
