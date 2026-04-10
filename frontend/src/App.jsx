import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRoutes from './router/AppRoutes';
import './App.css';

/**
 * Layout wrapper that conditionally shows Navbar + Sidebar for protected pages.
 */
function AppLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) {
    return <AppRoutes searchQuery={searchQuery} />;
  }

  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <AppRoutes searchQuery={searchQuery} />
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
