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

// Thêm token vào mỗi request
axiosClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response; // Nếu API thành công (mã 2xx), cho qua bình thường
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    // Trường hợp 1: Không có status (Backend chưa bật, sập nguồn, đứt mạng)
    if (!status) {
        window.location.href = '/error/503'; // Dịch vụ không khả dụng
        return Promise.reject(error);
    }

    // Trường hợp 2: Lỗi Xác thực (401)
    if (status === 401) {
        localStorage.removeItem('user'); // Xóa token cũ
        window.location.href = '/login'; // Đá về trang đăng nhập
        return Promise.reject(error);
    }

    // Trường hợp 3: Nhóm lỗi nghiêm trọng cần sang trang Full Màn Hình (403, 404, 500...)
    const severeErrors = [403, 404, 405, 408, 413, 415, 429, 500, 502, 503, 504];
    if (severeErrors.includes(status)) {
        window.location.href = `/error/${status}`; // Đá sang trang GenericError.jsx
        return Promise.reject(error);
    }

    // Trường hợp 4: Nhóm lỗi nhập liệu (400, 409)
    // KHÔNG chuyển trang. Trả lỗi về Component để nó tự báo đỏ ở ô Input.
    return Promise.reject(error);
  }
);

export default axiosClient;