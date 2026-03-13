import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

export const applyPromoCode = async (code, total) => {
    return await axios.post(`${API_URL}/apply-promo`, { code, total });
};

export const placeOrderApi = async (orderPayload) => {
    return await axios.post(`${API_URL}/place-order`, orderPayload);
};

export const getUserOrders = async (userId) => await axios.get(`${API_URL}/user/${userId}`);
export const getOrderItems = async (orderId) => await axios.get(`${API_URL}/${orderId}/items`);

// Hủy đơn hàng
export const cancelOrderApi = async (orderId, userId) => {
    return await axios.put(`${API_URL}/${orderId}/cancel?userId=${userId}`);
};