import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    
    // 1. Kiểm tra xem user đã đăng nhập chưa
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // 2. Hàm xử lý khi bấm vào Giỏ hàng
    const handleCartClick = () => {
        if (!user) {
            alert("Vui lòng đăng nhập để xem giỏ hàng!");
            navigate('/login'); // Chuyển hướng về trang đăng nhập
        } else {
            navigate('/cart'); // Sau này làm trang Cart thì URL sẽ tới đây
        }
    };

    // 3. Hàm Đăng xuất
    const handleLogout = () => {
        if(window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('user');
            navigate('/'); // Về trang chủ
        }
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    
                    {/* LOGO */}
                    <Link to="/" className="flex items-center cursor-pointer">
                        <i className="fas fa-shopping-basket text-emerald-500 text-2xl mr-2"></i>
                        <span className="font-bold text-xl tracking-tight text-gray-900">MiniMart</span>
                    </Link>
                    
                    {/* THANH TÌM KIẾM */}
                    <div className="flex-1 max-w-2xl px-8 hidden md:block">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm sản phẩm..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all"
                            />
                            <i className="fas fa-search absolute left-4 top-3 text-gray-400"></i>
                        </div>
                    </div>
                    
                    {/* MENU BÊN PHẢI */}
                    <div className="flex items-center space-x-6">
                        <Link to="/products" className="text-gray-600 hover:text-emerald-600 font-medium hidden md:block">Sản phẩm</Link>
                        
                        {/* GIỎ HÀNG (Có bảo mật) */}
                        <div onClick={handleCartClick} className="relative cursor-pointer text-gray-600 hover:text-emerald-600">
                            <i className="fas fa-shopping-cart text-xl"></i>
                            {user && ( // Chỉ hiện số lượng khi đã đăng nhập
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">0</span>
                            )}
                        </div>
                        
                        {/* KHU VỰC USER THÔNG MINH */}
                        {user ? (
                            // Đã đăng nhập: Hiện Avatar + Tên + Dropdown
                            <div className="relative group cursor-pointer py-4">
                                <div className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600">
                                    {/* ĐÃ SỬA: Kiểm tra nếu có avatar_url thì hiện ảnh, không thì hiện chữ cái */}
                                 {user.avatar_url ? (
                                   <img 
                                    src={user.avatar_url} 
                                    alt="avatar" 
                                     className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
                                                    />
                              ) : (
                               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold uppercase">
                                 {user.full_name ? user.full_name.charAt(0) : 'U'}
                              </div>
                             )}
                                    <span className="hidden md:block font-medium text-sm truncate max-w-[100px]">
                                        {user.full_name || user.username}
                                    </span>
                                </div>
                                
                                {/* Dropdown Menu (Chỉ hiện khi di chuột vào vùng group) */}
                                <div className="absolute right-0 top-12 w-48 mt-1 py-2 bg-white rounded-lg shadow-xl hidden group-hover:block border border-gray-100 transition-opacity">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <i className="fas fa-user-circle mr-2 w-4 text-emerald-500"></i> Hồ sơ cá nhân
                                    </Link>
                                    <Link to="/address" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <i className="fas fa-map-marker-alt mr-2 w-4 text-emerald-500"></i> Sổ địa chỉ
                                    </Link>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <i className="fas fa-box mr-2 w-4 text-emerald-500"></i> Đơn hàng của tôi
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                                        <i className="fas fa-sign-out-alt mr-2 w-4"></i> Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Chưa đăng nhập: Hiện nút Đăng ký / Đăng nhập
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600">Đăng nhập</Link>
                                <Link to="/register" className="text-sm font-medium bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors shadow-sm">Đăng ký</Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;