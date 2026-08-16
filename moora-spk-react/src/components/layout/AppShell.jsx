import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { SidebarOverlay } from './SidebarOverlay';
import { Toast } from '../ui/Toast';

const BREADCRUMBS = {
  '/': 'Beranda',
  '/login': 'Login',
  '/register': 'Daftar',
  '/history': 'History Perhitungan',
  '/step/1': 'Langkah 1 — Matriks Keputusan',
  '/step/2': 'Langkah 2 — Normalisasi',
  '/step/3': 'Langkah 3 — Matriks Terbobot',
  '/step/4': 'Langkah 4 — Optimasi Yi',
  '/step/5': 'Langkah 5 — Perankingan',
};

const AUTH_PAGES = ['/login', '/register'];

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = AUTH_PAGES.includes(location.pathname);
  const breadcrumb = BREADCRUMBS[location.pathname] || 'Beranda';

  // Store previous pathname in state to adjust state during render
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setSidebarOpen(false);
  }

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ESC to close sidebar
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Toggle auth-mode class on body
  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add('auth-mode');
    } else {
      document.body.classList.remove('auth-mode');
    }
  }, [isAuthPage]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-shell">
      {!isAuthPage && (
        <TopBar breadcrumb={breadcrumb} onToggleSidebar={toggleSidebar} />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <SidebarOverlay isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="content">
        <div className="content-inner" id="content">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  );
}
