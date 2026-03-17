import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Lấy thông tin admin từ localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Administrator', role: 'ADMIN' };

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn thoát khỏi trang Quản trị?")) {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Hàm xác định menu nào đang được chọn để bôi màu nổi bật
    const checkActive = (path) => {
        return location.pathname === path 
            ? "bg-gray-800 text-white rounded-lg" 
            : "text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors";
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            
            {/* ========================================== */}
            {/* SIDEBAR (CỘT BÊN TRÁI MÀU ĐEN)             */}
            {/* ========================================== */}
            <aside className="w-64 bg-[#111827] flex flex-col h-full shadow-2xl z-20 flex-shrink-0">
                {/* Logo */}
                <Link to="/">
                <div className="h-16 flex items-center px-6 bg-[#030712] border-b border-gray-800">
                    <i className="fas fa-shopping-basket text-emerald-500 text-2xl mr-3"></i>
                    <span className="font-bold text-xl text-white tracking-wide">Trang Chủ</span>
                </div>
                </Link>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 overflow-y-auto px-4 custom-scrollbar">
                    <Link to="/admin" className={`flex items-center px-4 py-3 mb-2 ${checkActive('/admin')}`}>
                        <i className="fas fa-chart-line w-6 text-lg"></i>
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mt-6 mb-3">Quản lý Dữ liệu</p>
                    
                    <Link to="/admin/products" className={`flex items-center px-4 py-3 mb-1 ${checkActive('/admin/products')}`}>
                        <i className="fas fa-box-open w-6 text-lg"></i> <span className="font-medium">Products</span>
                    </Link>
                    <Link to="/admin/categories" className={`flex items-center px-4 py-3 mb-1 ${checkActive('/admin/categories')}`}>
                        <i className="fas fa-tags w-6 text-lg"></i> <span className="font-medium">Categories</span>
                    </Link>
                    <Link to="/admin/orders" className={`flex items-center px-4 py-3 mb-1 ${checkActive('/admin/orders')}`}>
                        <i className="fas fa-shopping-bag w-6 text-lg"></i> <span className="font-medium">Orders</span>
                    </Link>
                    <Link to="/admin/reviews" className={`flex items-center px-4 py-3 mb-1 ${checkActive('/admin/reviews')}`}>
                        <i className="fas fa-star w-6 text-lg"></i> <span className="font-medium">Reviews</span>
                    </Link>

                    <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mt-6 mb-3">Hệ thống</p>
                    
                    <Link to="/admin/promotions" className={`flex items-center px-4 py-3 mb-1 ${checkActive('/admin/promotions')}`}>
                        <i className="fas fa-bullhorn w-6 text-lg"></i> <span className="font-medium">Promotions</span>
                    </Link>
                    <Link to="/admin/users" className={`flex items-center px-4 py-3 mb-1 ${checkActive('/admin/users')}`}>
                        <i className="fas fa-users w-6 text-lg"></i> <span className="font-medium">Users</span>
                    </Link>
                    <Link to="/admin/sliders" className={`flex items-center px-4 py-3 mb-1 ${checkActive('/admin/sliders')}`}>
                        <i className="fas fa-images w-6 text-lg"></i> <span className="font-medium">Sliders</span>
                    </Link>
                </nav>

                {/* Nút Đăng xuất */}
                <div className="p-4 border-t border-gray-800 bg-[#0f1523]">
                    <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-300 hover:bg-gray-800 w-full px-4 py-3 rounded-lg transition-colors font-medium">
                        <i className="fas fa-sign-out-alt w-6 text-lg"></i> Đăng xuất
                    </button>
                </div>
            </aside>


            {/* ========================================== */}
            {/* KHU VỰC BÊN PHẢI (TOPBAR & NỘI DUNG)         */}
            {/* ========================================== */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Topbar màu trắng */}
                <header className="h-16 bg-white flex items-center justify-between px-8 z-10 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 capitalize">
                        {location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').pop()}
                    </h1>
                    
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-emerald-500 transition relative">
                            <i className="fas fa-bell text-xl"></i>
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-3 cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition">
                            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                AD
                            </div>
                            <span className="font-medium text-sm text-gray-700 hidden sm:block">{user.full_name}</span>
                        </div>
                    </div>
                </header>

                {/* Khu vực Nội dung cuộn được (Nơi render các trang con) */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                    {/* 👇 MAGIC LÀ Ở ĐÂY: <Outlet /> sẽ lấy component tương ứng với URL nhúng vào chỗ này */}
                    <Outlet /> 
                </div>

            </main>

        </div>
    );
};

export default AdminLayout;