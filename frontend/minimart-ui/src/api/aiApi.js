import axiosClient from './axiosClient';

export const sendChatMessage = async (message) => {
    try {
        const response = await axiosClient.post('/ai/chat', { message });
        return response.data.reply;
    } catch (error) {
        console.error("Lỗi kết nối AI:", error);
        return "Lỗi kết nối đến máy chủ AI. Vui lòng thử lại sau!";
    }
};