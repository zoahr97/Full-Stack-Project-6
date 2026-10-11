import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppPage      from './pages/AppPage';
import TripsPage    from './pages/TripsPage';
import JournalPage  from './pages/JournalPage';
import ProfilePage  from './pages/ProfilePage';
import AdminPage    from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      {/* עמודים ציבוריים */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* עמודים מוגנים – כולם תחת AppPage שמכיל את ה-navbar */}
      <Route path="/users/:username" element={
        <ProtectedRoute><AppPage /></ProtectedRoute>
      }>
        <Route path="todos" element={<TripsPage />} />
        <Route path="posts" element={<JournalPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin"   element={<AdminPage />} />
      </Route>


      {/* Legacy TripDiary URLs kept working for convenience */}
      <Route path="/travelers/:username" element={
        <ProtectedRoute><AppPage /></ProtectedRoute>
      }>
        <Route path="trips" element={<TripsPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>

      {/* כל URL לא מוכר → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
