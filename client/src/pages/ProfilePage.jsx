import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api/travelers.api';
import '../styles/profile.css';

export default function ProfilePage() {
  const { session, updateSession } = useAuth();
  const user = session?.user;

  // ── עריכת פרטים אישיים ───────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: user?.name||'', email: user?.email||'',
    phone: user?.phone||'', website: user?.website||''
  });
  const [profileMsg,   setProfileMsg]   = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoad,  setProfileLoad]  = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileLoad(true); setProfileMsg(''); setProfileError('');
    try {
      const updated = await updateProfile(user.id, profileForm);
      // מעדכן session ו-localStorage כך שה-navbar יראה את השם החדש מיד
      updateSession({ ...user, ...updated });
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Update failed');
    } finally { setProfileLoad(false); }
  }

  // ── שינוי סיסמה ──────────────────────────────────────────
  const [passForm, setPassForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [passMsg,   setPassMsg]   = useState('');
  const [passError, setPassError] = useState('');
  const [passLoad,  setPassLoad]  = useState(false);

  async function handlePasswordSave(e) {
    e.preventDefault();
    setPassMsg(''); setPassError('');

    // בדיקה מקומית לפני שליחה לשרת
    if (passForm.newPassword !== passForm.confirmPassword)
      return setPassError('New passwords do not match');
    if (passForm.newPassword.length < 6)
      return setPassError('Password must be at least 6 characters');

    setPassLoad(true);
    try {
      await changePassword(user.id, {
        currentPassword: passForm.currentPassword,
        newPassword:     passForm.newPassword,
      });
      setPassMsg('Password changed successfully!');
      setPassForm({ currentPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) {
      setPassError(err.response?.data?.message || 'Password change failed');
    } finally { setPassLoad(false); }
  }

  return (
    <div className="profile-page">
      <h2 style={{ fontSize:'1.3rem', fontWeight:700, marginBottom:24, color:'var(--clr-text)' }}>
        My Profile
      </h2>

      {/* ── פרטים אישיים ─────────────────────────────────── */}
      <div className="profile-section">
        <div className="profile-section-title">Personal details</div>
        {profileMsg   && <div className="success-msg">{profileMsg}</div>}
        {profileError && <div className="error-msg">{profileError}</div>}

        <form className="profile-form" onSubmit={handleProfileSave}>
          <label>Username (cannot be changed)</label>
          <input value={user?.username||''} disabled />

          <label>Full name</label>
          <input value={profileForm.name} onChange={e => setProfileForm(f=>({...f,name:e.target.value}))}
            placeholder="Alice Cohen" required />

          <label>Email</label>
          <input type="email" value={profileForm.email} onChange={e => setProfileForm(f=>({...f,email:e.target.value}))}
            placeholder="alice@example.com" required />

          <label>Phone</label>
          <input value={profileForm.phone} onChange={e => setProfileForm(f=>({...f,phone:e.target.value}))}
            placeholder="050-1234567" />

          <label>Website</label>
          <input value={profileForm.website} onChange={e => setProfileForm(f=>({...f,website:e.target.value}))}
            placeholder="mysite.com" />

          <div className="profile-actions">
            <button type="submit" className="btn btn-primary" disabled={profileLoad}>
              {profileLoad ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      {/* ── שינוי סיסמה ──────────────────────────────────── */}
      <div className="profile-section">
        <div className="profile-section-title">Change password</div>
        {passMsg   && <div className="success-msg">{passMsg}</div>}
        {passError && <div className="error-msg">{passError}</div>}

        <form className="profile-form" onSubmit={handlePasswordSave}>
          <label>Current password</label>
          <input type="password" value={passForm.currentPassword}
            onChange={e => setPassForm(f=>({...f,currentPassword:e.target.value}))}
            placeholder="••••••••" required />

          <label>New password</label>
          <input type="password" value={passForm.newPassword}
            onChange={e => setPassForm(f=>({...f,newPassword:e.target.value}))}
            placeholder="Min. 6 characters" required minLength={6} />

          <label>Confirm new password</label>
          <input type="password" value={passForm.confirmPassword}
            onChange={e => setPassForm(f=>({...f,confirmPassword:e.target.value}))}
            placeholder="Repeat new password" required />

          <div className="profile-actions">
            <button type="submit" className="btn btn-primary" disabled={passLoad}>
              {passLoad ? 'Changing…' : 'Change password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
