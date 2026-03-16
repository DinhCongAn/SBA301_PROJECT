import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; 

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// TỰ ĐỘNG NHÉT TOKEN VÀO MỌI REQUEST GỬI ĐI
axiosClient.interceptors.request.use((config) => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Nếu có user và có token, tự động gắn vào Header
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;