import axiosClient from './axiosClient';

// 1. Lấy danh sách sản phẩm (Sử dụng params của axios để code siêu gọn)
export const fetchProducts = async (filters) => {
    try {
        const { search, categoryId, minPrice, maxPrice, sort, page, size } = filters;
        
        const response = await axiosClient.get('/products', {
            params: {
                page: page || 0,
                size: size || 9,
                search: search || undefined, // Axios tự động bỏ qua nếu là undefined
                category: categoryId,
                minPrice: minPrice !== null ? minPrice : undefined,
                maxPrice: maxPrice !== null ? maxPrice : undefined,
                sort: sort
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};

// 2. Lấy danh mục hiển thị ra Sidebar
export const fetchCategories = async () => {
    try {
        const response = await axiosClient.get('/home');
        return response.data.categories || [];
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        return [];
    }
};

// Lấy chi tiết 1 sản phẩm
export const fetchProductById = async (id) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
};

// Gọi AI Tóm tắt bình luận
export const fetchAiSummary = async (id) => {
    const response = await axiosClient.get(`/products/${id}/ai-summary`);
    return response.data.summary;
};

// Lấy danh sách đánh giá
export const fetchReviews = async (productId) => {
    const response = await axiosClient.get(`/products/${productId}/reviews`);
    return response.data;
};

// Gửi đánh giá mới
export const addReviewApi = async (productId, reviewData) => {
    const response = await axiosClient.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
};

// Lấy sản phẩm tương tự
export const fetchSimilarProducts = async (id) => {
    const response = await axiosClient.get(`/products/${id}/similar`);
    return response.data;
};