import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Nếu chưa đăng nhập -> Đẩy ra trang Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Nếu đã đăng nhập nhưng không phải ADMIN -> Đẩy về trang chủ
    if (user.role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập khu vực quản trị!");
        return <Navigate to="/" replace />;
    }

    // 3. Nếu đúng là ADMIN -> Mở cửa cho đi tiếp (Outlet)
    return <Outlet />;
};

export default AdminRoute;