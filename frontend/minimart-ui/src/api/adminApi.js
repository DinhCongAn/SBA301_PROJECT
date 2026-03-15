import axios from "axios";
const API_URL = "http://localhost:8080/api/admin";

export const getDashboardStats = () => axios.get(`${API_URL}/dashboard/stats`);

export const fetchAdminProducts = (page = 0, size = 10, search = '', categoryId = '', sort = 'NEWEST', status = 'active') => {
    let url = `${API_URL}/products?page=${page}&size=${size}&sortMode=${sort}&status=${status}`;
    if (search) url += `&search=${search}`;
    if (categoryId && categoryId !== 'ALL') url += `&categoryId=${categoryId}`;
    return axios.get(url);
};

export const saveAdminProduct = (formData) => axios.post(`${API_URL}/products`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteAdminProduct = (id) => axios.delete(`${API_URL}/products/${id}`);
export const restoreAdminProduct = (id) => axios.put(`${API_URL}/products/${id}/restore`);
export const generateAiProductDesc = (productName) => axios.post(`${API_URL}/products/generate-ai-desc`, { productName });
export const fetchAdminCategories = () => axios.get(`${API_URL}/categories`);