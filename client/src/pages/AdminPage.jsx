import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAllUsers, fetchUserActivity, blockUser, unblockUser } from '../api/admin.api';
import '../styles/admin.css';

export default function AdminPage() {
  const { session }           = useAuth();
  const navigate              = useNavigate();
  const { username }          = useParams();
  const [users, setUsers]     = useState([]);
  const [activity, setActivity] = useState(null); // פעילות משתמש נבחר
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // הגנה נוספת בצד קליינט – אדמין בלבד
  // ההגנה האמיתית היא בשרת (verifyAdmin middleware)
  useEffect(() => {
    if (!session?.user?.is_admin) {
      navigate(`/travelers/${username}/trips`, { replace: true });
      return;
    }
    fetchAllUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  // חסימת משתמש
  async function handleBlock(id) {
    if (!window.confirm('Block this user?')) return;
    try {
      await blockUser(id);
      setUsers(us => us.map(u => u.id === id ? { ...u, is_blocked: true } : u));
      if (activity?.id === id) setActivity(a => ({ ...a, is_blocked: true }));
    } catch (err) { setError(err.response?.data?.message || 'Failed to block'); }
  }

  // ביטול חסימה
  async function handleUnblock(id) {
    try {
      await unblockUser(id);
      setUsers(us => us.map(u => u.id === id ? { ...u, is_blocked: false } : u));
      if (activity?.id === id) setActivity(a => ({ ...a, is_blocked: false }));
    } catch (err) { setError(err.response?.data?.message || 'Failed to unblock'); }
  }

  // הצגת פעילות משתמש – trips + entries
  async function handleShowActivity(id) {
    try {
      const data = await fetchUserActivity(id);
      setActivity(data);
    } catch { setError('Failed to load activity'); }
  }

  return (
    <div className="admin-page">
      <h2 className="admin-title">⚙️ Admin Panel</h2>

      {error   && <div className="error-msg">{error}</div>}
      {loading && <div className="spinner" />}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>@{u.username}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.is_admin
                      ? <span className="badge badge-ongoing">Admin</span>
                      : u.is_blocked
                        ? <span className="badge badge-blocked">Blocked</span>
                        : <span className="badge badge-completed">Active</span>
                    }
                  </td>
                  <td>
                    <div className="admin-actions">
                      {/* כפתור פעילות */}
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => handleShowActivity(u.id)}>
                        📊 Activity
                      </button>

                      {/* כפתורי חסימה – לא מוצגים לאדמין */}
                      {!u.is_admin && (
                        u.is_blocked
                          ? <button className="btn btn-success btn-sm" onClick={() => handleUnblock(u.id)}>✅ Unblock</button>
                          : <button className="btn btn-danger btn-sm"  onClick={() => handleBlock(u.id)}>🚫 Block</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* כרטיס פעילות משתמש נבחר */}
      {activity && (
        <div className="activity-card">
          <div className="activity-title">
            Activity for @{activity.username}
            <button className="btn btn-ghost btn-sm" style={{ marginLeft:12 }}
              onClick={() => setActivity(null)}>✕ Close</button>
          </div>
          <div className="activity-row">
            <span className="activity-label">Full name</span>
            <span className="activity-value">{activity.name}</span>
          </div>
          <div className="activity-row">
            <span className="activity-label">Email</span>
            <span className="activity-value">{activity.email}</span>
          </div>
          <div className="activity-row">
            <span className="activity-label">Trips</span>
            <span className="activity-value">{activity.trips}</span>
          </div>
          <div className="activity-row">
            <span className="activity-label">Journal entries</span>
            <span className="activity-value">{activity.entries}</span>
          </div>
          <div className="activity-row">
            <span className="activity-label">Status</span>
            <span className="activity-value">{activity.is_blocked ? '🚫 Blocked' : '✅ Active'}</span>
          </div>
          <div className="activity-row">
            <span className="activity-label">Member since</span>
            <span className="activity-value">{new Date(activity.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
