import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function LoginPage() {
  const { login }         = useAuth();
  const navigate          = useNavigate();
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      navigate(`/travelers/${user.username}/trips`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      {/* ── צד שמאל – תמונת טיול ── */}
      <div className="auth-image-side">
        <div className="auth-image-destinations">
          <span className="auth-dest-chip">🗼 Paris</span>
          <span className="auth-dest-chip">🗻 Alps</span>
          <span className="auth-dest-chip">🏖️ Bali</span>
        </div>
        <div className="auth-image-text">
          <h2>Your journey begins<br />with a single step</h2>
          <p>Document every adventure, memory and destination</p>
        </div>
      </div>

      {/* ── צד ימין – טופס ── */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">✈️</div>
            <span className="auth-logo-text">TripDiary</span>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your travel diary ✨</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">⚠️ {error}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text"
                value={form.username} onChange={handleChange}
                placeholder="e.g. alice" required autoFocus />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••" required />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

    </div>
  );
}