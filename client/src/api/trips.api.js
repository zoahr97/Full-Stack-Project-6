import api from './axiosClient';

// אפשר לסנן: fetchTrips(userId, { status: 'planned' })
export const fetchTrips = (userId, params = {}) =>
  api.get(`/users/${userId}/todos`, { params }).then(r => r.data);

export const createTrip = (userId, data) =>
  api.post(`/users/${userId}/todos`, data).then(r => r.data);

export const updateTrip = (userId, tripId, data) =>
  api.put(`/users/${userId}/todos/${tripId}`, data).then(r => r.data);

export const deleteTrip = (userId, tripId) =>
  api.delete(`/users/${userId}/todos/${tripId}`).then(r => r.data);
