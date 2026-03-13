import axios from "axios";
const API_URL = "http://localhost:8080/api/addresses";

export const getAddresses = async (userId) => await axios.get(`${API_URL}/user/${userId}`);
export const addAddress = async (userId, data) => await axios.post(`${API_URL}/user/${userId}`, data);
export const updateAddress = async (addrId, data) => await axios.put(`${API_URL}/${addrId}`, data);
export const deleteAddress = async (addrId) => await axios.delete(`${API_URL}/${addrId}`);
export const setDefaultAddress = async (addrId) => await axios.put(`${API_URL}/${addrId}/default`);