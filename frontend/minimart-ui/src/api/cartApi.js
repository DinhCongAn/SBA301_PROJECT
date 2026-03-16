import axiosClient from './axiosClient';

export const getCart = (userId) => axiosClient.get(`/cart/${userId}`);

export const addToCartApi = (userId, productId, quantity) => axiosClient.post(`/cart/${userId}/add`, { productId, quantity });

export const updateCartItemApi = (userId, productId, quantity) => axiosClient.put(`/cart/${userId}/update`, { productId, quantity });

export const removeCartItem = (cartItemId) => axiosClient.delete(`/cart/${cartItemId}`);

export const getAiChefRecipe = (productNames) => axiosClient.post(`/cart/ai-chef`, productNames);