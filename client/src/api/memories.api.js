import api from './axiosClient';

export const fetchMemories  = (entryId) =>
  api.get(`/posts/${entryId}/comments`).then(r => r.data);

export const createMemory   = (entryId, data) =>
  api.post(`/posts/${entryId}/comments`, data).then(r => r.data);

export const updateMemory   = (entryId, memoryId, data) =>
  api.put(`/posts/${entryId}/comments/${memoryId}`, data).then(r => r.data);

export const deleteMemory   = (entryId, memoryId) =>
  api.delete(`/posts/${entryId}/comments/${memoryId}`).then(r => r.data);
