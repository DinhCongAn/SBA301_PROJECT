import axios from "axios";

// 1. Lấy danh sách sản phẩm (có kèm các bộ lọc mới)
export const fetchProducts = async (filters) => {
    try {
        const { search, categoryId, minPrice, maxPrice, sort, page, size } = filters;
        let url = `http://localhost:8080/api/products?page=${page || 0}&size=${size || 9}`;
        
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (categoryId) url += `&category=${categoryId}`;
        if (minPrice !== null) url += `&minPrice=${minPrice}`;
        if (maxPrice !== null) url += `&maxPrice=${maxPrice}`;
        if (sort) url += `&sort=${sort}`;
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        return { content: [], totalPages: 0, totalElements: 0 };
    }
};

// 2. Lấy danh mục hiển thị ra Sidebar
export const fetchCategories = async () => {
    try {
        // Tận dụng api home đã có để lấy danh mục (hoặc dùng api categories riêng)
        const response = await axios.get("http://localhost:8080/api/home");
        return response.data.categories || [];
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        return [];
    }
};