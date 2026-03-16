import axiosClient from './axiosClient';

export const getAddresses = (userId) => axiosClient.get(`/addresses/user/${userId}`);

export const addAddress = (userId, data) => axiosClient.post(`/addresses/user/${userId}`, data);

export const updateAddress = (addrId, data) => axiosClient.put(`/addresses/${addrId}`, data);

export const deleteAddress = (addrId) => axiosClient.delete(`/addresses/${addrId}`);

export const setDefaultAddress = (addrId) => axiosClient.put(`/addresses/${addrId}/default`);