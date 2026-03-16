import axiosClient from './axiosClient';

// ==========================================
// 1. QUẢN LÝ SẢN PHẨM (PRODUCTS)
// ==========================================
export const fetchAdminProducts = (page = 0, size = 10, search = '', categoryId = '', sort = 'NEWEST', status = 'active') => {
    let url = `/admin/products?page=${page}&size=${size}&sortMode=${sort}&status=${status}`;
    if (search) url += `&search=${search}`;
    if (categoryId && categoryId !== 'ALL') url += `&categoryId=${categoryId}`;
    return axiosClient.get(url);
};
export const saveAdminProduct = (formData) => axiosClient.post(`/admin/products`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteAdminProduct = (id) => axiosClient.delete(`/admin/products/${id}`);
export const restoreAdminProduct = (id) => axiosClient.put(`/admin/products/${id}/restore`);
export const generateAiProductDesc = (productName) => axiosClient.post(`/admin/products/generate-ai-desc`, { productName });

// ==========================================
// 2. QUẢN LÝ DANH MỤC (CATEGORIES)
// ==========================================
export const fetchAdminCategories = (page = 0, size = 10, search = '', status = 'active') => {
    let url = `/admin/categories?page=${page}&size=${size}&status=${status}`;
    if (search) url += `&search=${search}`;
    return axiosClient.get(url);
};

export const fetchAllCategoriesSimple = () => axiosClient.get(`/admin/categories/all`);

export const saveAdminCategory = (formData) => axiosClient.post(`/admin/categories`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const deleteAdminCategory = (id) => axiosClient.delete(`/admin/categories/${id}`);
export const restoreAdminCategory = (id) => axiosClient.put(`/admin/categories/${id}/restore`);

// ==========================================
// 3. QUẢN LÝ ĐƠN HÀNG (ORDERS)
// ==========================================
export const fetchAdminOrders = (page = 0, size = 10, search = '', status = 'ALL', payment = 'ALL', startDate = '', endDate = '') => {
    let url = `/admin/orders?page=${page}&size=${size}&status=${status}&paymentMethod=${payment}`;
    if (search) url += `&search=${search}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return axiosClient.get(url);
};

export const updateAdminOrderStatus = (id, status) => axiosClient.put(`/admin/orders/${id}/status`, { status });

// ==========================================
// 4. QUẢN LÝ KHUYẾN MÃI (PROMOTIONS)
// ==========================================
export const fetchAdminPromotions = (page = 0, size = 10, search = '', type = 'ALL', active = '') => {
    let url = `/admin/promotions?page=${page}&size=${size}&type=${type}`;
    if (search) url += `&search=${search}`;
    if (active !== '') url += `&active=${active}`; // Truyền 'true' hoặc 'false'
    return axiosClient.get(url);
};

export const saveAdminPromotion = (data) => axiosClient.post(`/admin/promotions`, data);
export const toggleAdminPromotion = (id) => axiosClient.put(`/admin/promotions/${id}/toggle`);
export const deleteAdminPromotion = (id) => axiosClient.delete(`/admin/promotions/${id}`);

// ==========================================
// 5. QUẢN LÝ NGƯỜI DÙNG (USERS)
// ==========================================
export const fetchAdminUsers = (page = 0, size = 10, search = '') => axiosClient.get(`/admin/users?page=${page}&size=${size}&search=${search}`);
export const updateUserRole = (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role });
export const toggleUserLock = (id) => axiosClient.put(`/admin/users/${id}/toggle-lock`);

// ==========================================
// 6. QUẢN LÝ SLIDER (BANNER)
// ==========================================
export const fetchAdminSliders = (search = '', status = 'ALL') => {
    let url = `/admin/sliders?status=${status}`;
    if (search) url += `&search=${search}`;
    return axiosClient.get(url);
};
export const saveAdminSlider = (data) => axiosClient.post(`/admin/sliders`, data);
export const deleteAdminSlider = (id) => axiosClient.delete(`/admin/sliders/${id}`);
