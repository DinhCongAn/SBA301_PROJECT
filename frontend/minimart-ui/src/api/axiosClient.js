import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const user = JSON.parse(localStorage.getItem('user'));

    if (!status) {
        window.location.href = '/error/503';
        return Promise.reject(error);
    }

    if (status === 401 || status === 403) {
        // Chỉ redirect nếu user đã có token (token hết hạn)
        // Nếu chưa có token (đang ở trang login), return error để form xử lý
        if (user && user.token) {
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }

    const severeErrors = [404, 405, 408, 413, 415, 429, 500, 502, 503, 504];
    if (severeErrors.includes(status)) {
        window.location.href = `/error/${status}`;
        return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;