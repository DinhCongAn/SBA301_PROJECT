import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

export const applyPromoCode = async (code, total) => {
    return await axios.post(`${API_URL}/apply-promo`, { code, total });
};

export const placeOrderApi = async (orderPayload) => {
    return await axios.post(`${API_URL}/place-order`, orderPayload);
};