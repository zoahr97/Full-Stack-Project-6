import api from './axiosClient';

export const fetchAllUsers     = () =>
  api.get('/admin/users').then(r => r.data);

export const fetchUserActivity = (userId) =>
  api.get(`/admin/users/${userId}/activity`).then(r => r.data);

export const blockUser         = (userId) =>
  api.put(`/admin/users/${userId}/block`).then(r => r.data);

export const unblockUser       = (userId) =>
  api.put(`/admin/users/${userId}/unblock`).then(r => r.data);
