import axios from "axios";
const API_URL = "http://localhost:8080/api/admin";

// ==========================================
// 1. QUẢN LÝ SẢN PHẨM (PRODUCTS)
// ==========================================
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

// ==========================================
// 2. QUẢN LÝ DANH MỤC (CATEGORIES)
// ==========================================
export const fetchAdminCategories = (page = 0, size = 10, search = '', status = 'active') => {
    let url = `${API_URL}/categories?page=${page}&size=${size}&status=${status}`;
    if (search) url += `&search=${search}`;
    return axios.get(url);
};

export const fetchAllCategoriesSimple = () => axios.get(`${API_URL}/categories/all`);

export const saveAdminCategory = (formData) => axios.post(`${API_URL}/categories`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteAdminCategory = (id) => axios.delete(`${API_URL}/categories/${id}`);
export const restoreAdminCategory = (id) => axios.put(`${API_URL}/categories/${id}/restore`);

// --- QUẢN LÝ ĐƠN HÀNG ---
export const fetchAdminOrders = (page = 0, size = 10, search = '', status = 'ALL', payment = 'ALL', startDate = '', endDate = '') => {
    let url = `${API_URL}/orders?page=${page}&size=${size}&status=${status}&paymentMethod=${payment}`;
    if (search) url += `&search=${search}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return axios.get(url);
};

export const updateAdminOrderStatus = (id, status) => axios.put(`${API_URL}/orders/${id}/status`, { status });

// --- QUẢN LÝ KHUYẾN MÃI ---
export const fetchAdminPromotions = (page = 0, size = 10, search = '', type = 'ALL', active = '') => {
    let url = `${API_URL}/promotions?page=${page}&size=${size}&type=${type}`;
    if (search) url += `&search=${search}`;
    if (active !== '') url += `&active=${active}`; // Truyền 'true' hoặc 'false'
    return axios.get(url);
};

export const saveAdminPromotion = (data) => axios.post(`${API_URL}/promotions`, data);
export const toggleAdminPromotion = (id) => axios.put(`${API_URL}/promotions/${id}/toggle`);
export const deleteAdminPromotion = (id) => axios.delete(`${API_URL}/promotions/${id}`);

// --- QUẢN LÝ NGƯỜI DÙNG ---
export const fetchAdminUsers = (page = 0, size = 10, search = '') => axios.get(`${API_URL}/users?page=${page}&size=${size}&search=${search}`);
export const updateUserRole = (id, role) => axios.put(`${API_URL}/users/${id}/role`, { role });
export const toggleUserLock = (id) => axios.put(`${API_URL}/users/${id}/toggle-lock`);