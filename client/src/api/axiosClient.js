import axios from 'axios';

// instance יחיד – כל קבצי ה-api משתמשים בו.
// ה-interceptor מוסיף JWT אוטומטית לכל בקשה מוגנת.
const api = axios.create({ baseURL: '/' });

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('user');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { /* localStorage פגום */ }
  }
  return config;
});

export default api;
