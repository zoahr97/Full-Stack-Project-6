import api from './axiosClient';

export const fetchEntries = (userId) =>
  api.get(`/users/${userId}/posts`).then(r => r.data);

export const createEntry  = (userId, data) =>
  api.post(`/users/${userId}/posts`, data).then(r => r.data);

export const updateEntry  = (userId, entryId, data) =>
  api.put(`/users/${userId}/posts/${entryId}`, data).then(r => r.data);

// השרת מוחק memories לפני הרשומה
export const deleteEntry  = (userId, entryId) =>
  api.delete(`/users/${userId}/posts/${entryId}`).then(r => r.data);
