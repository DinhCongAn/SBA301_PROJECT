import axios from "axios";

export const sendChatMessage = async (message) => {
    try {
        const response = await axios.post("http://localhost:8080/api/ai/chat", { message });
        return response.data.reply;
    } catch (error) {
        console.error("Lỗi kết nối AI:", error);
        return "Lỗi kết nối đến máy chủ AI. Vui lòng thử lại sau!";
    }
};