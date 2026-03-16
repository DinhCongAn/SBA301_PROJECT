import axiosClient from './axiosClient';

export const loginApi = (username, password) => axiosClient.post('/auth/login', { username, password });

export const registerApi = (userData) => axiosClient.post('/auth/register', userData);

export const resetPasswordApi = (email, newPassword) => axiosClient.post('/auth/reset-password', { email, newPassword });

export const googleLoginApi = (token) => axiosClient.post('/auth/google-login', { token });