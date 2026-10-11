import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function RegisterPage() {
  const { register }    = useAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ username:'', name:'', email:'', password:'', phone:'', website:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      navigate(`/travelers/${user.username}/trips`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      {/* ── צד שמאל – תמונת טיול ── */}
      <div className="auth-image-side" style={{
        backgroundImage: `linear-gradient(160deg, rgba(0,0,0,.4) 0%, rgba(41,128,185,.3) 100%),
          url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80')`
      }}>
        <div className="auth-image-destinations">
          <span className="auth-dest-chip">🌏 Tokyo</span>
          <span className="auth-dest-chip">🕌 Istanbul</span>
          <span className="auth-dest-chip">🌴 Maldives</span>
        </div>
        <div className="auth-image-text">
          <h2>Every trip tells<br />a story</h2>
          <p>Join thousands of travelers documenting their adventures</p>
        </div>
      </div>

      {/* ── צד ימין – טופס ── */}
      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">✈️</div>
            <span className="auth-logo-text">TripDiary</span>
          </div>

          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Start your travel diary today 🌍</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">⚠️ {error}</div>}

            <div className="form-group">
              <label>Username *</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="e.g. alice" required autoFocus />
            </div>
            <div className="form-group">
              <label>Full name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Alice Cohen" required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="alice@example.com" required />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <div className="form-group">
              <label>Phone (optional)</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="050-1234567" />
            </div>
            <div className="form-group">
              <label>Website (optional)</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="mysite.com" />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

    </div>
  );
}