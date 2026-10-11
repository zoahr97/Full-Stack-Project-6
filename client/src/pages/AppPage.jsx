import { useState } from 'react';
import { Outlet, useNavigate, NavLink, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/app.css';

export default function AppPage() {
  const { session, logout } = useAuth();
  const navigate            = useNavigate();
  const { username }        = useParams();
  const [showInfo, setShowInfo] = useState(false);
  const user = session?.user;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-layout">
      <nav className="navbar">
        <span className="navbar-brand">✈️ TripDiary</span>

        <NavLink to={`/users/${username}/todos`}
          className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
          Todos
        </NavLink>

        <NavLink to={`/users/${username}/posts`}
          className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
          Posts
        </NavLink>

        <NavLink to={`/users/${username}/profile`}
          className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}>
          Profile
        </NavLink>

        {/* !! מוודא שהערך הוא boolean אמיתי ולא 0 */}
        {!!user?.is_admin && (
          <NavLink to={`/users/${username}/admin`}
            className={({ isActive }) => `nav-btn nav-btn-admin${isActive ? ' active' : ''}`}>
            ⚙️ Admin
          </NavLink>
        )}

        <button className="nav-btn" onClick={() => setShowInfo(v => !v)}>
          ℹ️ Info
        </button>

        <button className="nav-btn nav-btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="app-content">
        {showInfo && user && (
          <div className="info-panel">
            <div className="info-avatar">{user.name?.[0]?.toUpperCase()}</div>
            <div className="info-details">
              <div className="info-name">{user.name}</div>
              <div className="info-row">Username: <span>@{user.username}</span></div>
              <div className="info-row">Email: <span>{user.email}</span></div>
              {user.phone   && <div className="info-row">Phone: <span>{user.phone}</span></div>}
              {user.website && <div className="info-row">Website: <span>{user.website}</span></div>}
              {!!user.is_admin && <div className="info-row">Role: <span>🔑 Admin</span></div>}
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}