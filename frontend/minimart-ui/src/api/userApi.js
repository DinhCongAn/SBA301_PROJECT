import axiosClient from './axiosClient';

export const updateProfileApi = (userId, profileData) => axiosClient.put(`/users/${userId}/profile`, profileData);

export const changePasswordApi = (userId, passwordData) => axiosClient.put(`/users/${userId}/change-password`, passwordData);