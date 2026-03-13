import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

export const getCart = async (userId) => await axios.get(`${API_URL}/${userId}`);
export const addToCartApi = async (userId, productId, quantity) => await axios.post(`${API_URL}/${userId}/add`, { productId, quantity });
export const updateCartItemApi = async (userId, productId, quantity) => await axios.put(`${API_URL}/${userId}/update`, { productId, quantity });
export const removeCartItem = async (cartItemId) => await axios.delete(`${API_URL}/${cartItemId}`);
export const getAiChefRecipe = async (productNames) => await axios.post(`${API_URL}/ai-chef`, productNames);