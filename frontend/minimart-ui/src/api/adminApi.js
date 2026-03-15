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
// Dùng cho bảng Quản lý Danh mục (Có phân trang)
export const fetchAdminCategories = (page = 0, size = 10, search = '', status = 'active') => {
    let url = `${API_URL}/categories?page=${page}&size=${size}&status=${status}`;
    if (search) url += `&search=${search}`;
    return axios.get(url);
};

// Dùng cho Dropdown chọn danh mục trong Form Sản phẩm (Lấy tất cả mảng)
export const fetchAllCategoriesSimple = () => axios.get(`${API_URL}/categories/all`);

export const saveAdminCategory = (formData) => axios.post(`${API_URL}/categories`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteAdminCategory = (id) => axios.delete(`${API_URL}/categories/${id}`);
export const restoreAdminCategory = (id) => axios.put(`${API_URL}/categories/${id}/restore`);