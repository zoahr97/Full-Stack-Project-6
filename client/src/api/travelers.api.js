import api from './axiosClient';

export const fetchProfile   = (userId) =>
  api.get(`/users/${userId}`).then(r => r.data);

export const updateProfile  = (userId, data) =>
  api.put(`/users/${userId}`, data).then(r => r.data);

// שינוי סיסמה – שולח סיסמה ישנה + חדשה, השרת מאמת
export const changePassword = (userId, data) =>
  api.put(`/users/${userId}/password`, data).then(r => r.data);
