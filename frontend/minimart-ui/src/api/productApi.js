import axios from "axios";

export const fetchProducts = async (searchQuery = null) => {
    try {
        let url = "http://localhost:8080/api/products";
        if (searchQuery) url += `?search=${searchQuery}`;
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
        return [];
    }
};