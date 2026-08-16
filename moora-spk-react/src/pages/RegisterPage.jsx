import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nama.trim()) { setError('Nama tidak boleh kosong.'); return; }
    if (!email.trim()) { setError('Email tidak boleh kosong.'); return; }
    if (password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (password !== confirm) { setError('Konfirmasi password tidak cocok.'); return; }

    setLoading(true);
    const result = await register(nama.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      showToast(result.message || 'Registrasi berhasil!', 'success');
      navigate('/login');
    } else {
      setError(result.message || 'Registrasi gagal.');
    }
  };

  return (
    <div className="page">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon"><UserPlus size={32} /></div>
            <h1 className="auth-title">Daftar Akun</h1>
            <p className="auth-subtitle">Buat akun baru untuk menggunakan SPK MOORA</p>
          </div>

          <form id="register-form" className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="reg-nama">Nama Lengkap</label>
              <input type="text" id="reg-nama" placeholder="Masukkan nama lengkap" autoComplete="name" required value={nama} onChange={(e) => setNama(e.target.value)} autoFocus />
            </div>
            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <input type="email" id="reg-email" placeholder="nama@email.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <div className="password-wrapper">
                <input type={showPw ? 'text' : 'password'} id="reg-password" placeholder="Minimal 6 karakter" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="password-toggle" tabIndex={-1} onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="reg-confirm">Konfirmasi Password</label>
              <div className="password-wrapper">
                <input type={showCf ? 'text' : 'password'} id="reg-confirm" placeholder="Ulangi password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                <button type="button" className="password-toggle" tabIndex={-1} onClick={() => setShowCf(!showCf)}>{showCf ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              <span className="btn-text" style={{ display: loading ? 'none' : 'inline' }}>Daftar</span>
              <span className="btn-loader" style={{ display: loading ? 'inline-flex' : 'none' }}><Loader2 size={18} className="spin" /></span>
            </button>
          </form>

          <div className="auth-footer">
            <p>Sudah punya akun? <a href="#/login" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Masuk di sini</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
