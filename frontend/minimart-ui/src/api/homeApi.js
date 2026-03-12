import axios from "axios";

export const fetchHomeData = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/home");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API trang chủ:", error);
        throw error;
    }
};