import axiosClient from './axiosClient';

export const applyPromoCode = (code, total) => axiosClient.post('/orders/apply-promo', { code, total });

export const placeOrderApi = (orderPayload) => axiosClient.post('/orders/place-order', orderPayload);

export const getUserOrders = (userId) => axiosClient.get(`/orders/user/${userId}`);

export const getOrderItems = (orderId) => axiosClient.get(`/orders/${orderId}/items`);

export const cancelOrderApi = (orderId, userId) => axiosClient.put(`/orders/${orderId}/cancel?userId=${userId}`);