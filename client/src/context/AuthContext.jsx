import { createContext, useContext, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // מנסה לשחזר session קיים מה-localStorage בטעינה הראשונה
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  // login – שאילתה אחת לשרת, לא מביא כל המשתמשים!
  async function login(username, password) {
    const data = await loginRequest(username, password);
    localStorage.setItem('user', JSON.stringify(data));
    setSession(data);
    return data.user;
  }

  async function register(formData) {
    const data = await registerRequest(formData);
    localStorage.setItem('user', JSON.stringify(data));
    setSession(data);
    return data.user;
  }

  // logout – מנקה localStorage ו-state
  // navigate עם replace:true ב-AppPage מבטיח שלחיצת "חזור" לא תחזיר לאפליקציה
  function logout() {
    localStorage.removeItem('user');
    setSession(null);
  }

  // מעדכן פרטי משתמש ב-session אחרי עריכת פרופיל
  function updateSession(updatedUser) {
    const newSession = { ...session, user: updatedUser };
    localStorage.setItem('user', JSON.stringify(newSession));
    setSession(newSession);
  }

  return (
    <AuthContext.Provider value={{ session, login, register, logout, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
