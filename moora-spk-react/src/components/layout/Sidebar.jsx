import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, Table2, Sigma, Weight, TrendingUpDown, Trophy, ClipboardList, LogOut, LogIn } from 'lucide-react';

const ICON_SIZE = 16;

const NAV_ITEMS = [
  { page: '/', icon: <Home size={ICON_SIZE} />, label: 'Beranda' },
  { divider: true },
  { page: '/step/1', icon: <Table2 size={ICON_SIZE} />, label: 'Matriks Keputusan' },
  { page: '/step/2', icon: <Sigma size={ICON_SIZE} />, label: 'Normalisasi' },
  { page: '/step/3', icon: <Weight size={ICON_SIZE} />, label: 'Matriks Terbobot' },
  { page: '/step/4', icon: <TrendingUpDown size={ICON_SIZE} />, label: 'Optimasi Yi' },
  { page: '/step/5', icon: <Trophy size={ICON_SIZE} />, label: 'Hasil Perankingan' },
  { divider: true },
  { page: '/history', icon: <ClipboardList size={ICON_SIZE} />, label: 'History', authOnly: true },
];

export function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isLoggedIn, logout } = useAuth();

  const handleNav = (page) => {
    onClose();
    navigate(page);
  };

  const handleLogout = () => {
    logout().then(() => {
      onClose();
      navigate('/login');
    });
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <nav className={`sidebar${isOpen ? ' open' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">SPK MOORA</span>
      </div>
      <div className="sidebar-nav">
        {NAV_ITEMS.map((item, idx) => {
          if (item.divider) {
            return <div key={`div-${idx}`} className="sidebar-divider" />;
          }
          if (item.authOnly && !isLoggedIn) return null;
          const isActive = location.pathname === item.page;
          return (
            <button
              key={item.page}
              className={`sidebar-item${isActive ? ' active' : ''}`}
              onClick={() => handleNav(item.page)}
            >
              <span className="step-num">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="sidebar-footer">
        {isLoggedIn && currentUser ? (
          <>
            <div className="user-info">
              <div className="user-avatar">
                {currentUser.nama ? currentUser.nama.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <div className="user-name">{currentUser.nama}</div>
                <div className="user-email">{currentUser.email}</div>
              </div>
            </div>
            <button className="btn btn-sm btn-outline sidebar-logout-btn" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-sm btn-primary sidebar-login-btn" onClick={handleLogin}>
              <LogIn size={14} /> Login
            </button>
            <div style={{ marginTop: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              © 2025 Kelompok SPK
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
