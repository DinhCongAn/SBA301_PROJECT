import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginApi = async (username, password) => await axios.post(`${API_URL}/login`, { username, password });
export const registerApi = async (userData) => await axios.post(`${API_URL}/register`, userData);
export const resetPasswordApi = async (email, newPassword) => await axios.post(`${API_URL}/reset-password`, { email, newPassword });
export const googleLoginApi = async (token) => await axios.post(`${API_URL}/google-login`, { token });