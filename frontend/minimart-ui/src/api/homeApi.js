import axiosClient from './axiosClient';

export const fetchHomeData = async () => {
    try {
        const response = await axiosClient.get('/home');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API trang chủ:", error);
        throw error;
    }
};