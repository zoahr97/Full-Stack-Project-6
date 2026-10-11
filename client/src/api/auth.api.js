import api from './axiosClient';

export const loginRequest    = (username, password) =>
  api.post('/auth/login',    { username, password }).then(r => r.data);

export const registerRequest = (formData) =>
  api.post('/auth/register', formData).then(r => r.data);
