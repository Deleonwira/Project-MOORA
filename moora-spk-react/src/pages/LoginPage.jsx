import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDataStore } from '../hooks/useDataStore';
import { useToast } from '../hooks/useToast';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { loadFromServer } = useDataStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email dan password harus diisi.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      showToast(`Login berhasil! Selamat datang, ${result.user.nama}`, 'success');
      await loadFromServer();
      navigate('/');
    } else {
      setError(result.message || 'Login gagal.');
    }
  };

  return (
    <div className="page">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon"><Lock size={32} /></div>
            <h1 className="auth-title">Masuk</h1>
            <p className="auth-subtitle">Masuk ke akun SPK MOORA Anda</p>
          </div>

          <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                placeholder="nama@email.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              <span className="btn-text" style={{ display: loading ? 'none' : 'inline' }}>Masuk</span>
              <span className="btn-loader" style={{ display: loading ? 'inline-flex' : 'none' }}><Loader2 size={18} className="spin" /></span>
            </button>
          </form>

          <div className="auth-footer">
            <p>Belum punya akun? <a href="#/register" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Daftar di sini</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
