import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Enter để tìm kiếm
    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    

    // Xóa keyword
    const clearSearch = () => {
        setSearchQuery('');
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
                    
                    {/* SEARCH */}
                    <div className="flex-1 max-w-2xl px-8 hidden md:block">
                        <div className="relative">

                            <input 
                                type="text" 
                                placeholder="Tìm kiếm sản phẩm (Ví dụ: Chuối, Cà chua)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full pl-10 pr-10 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all"
                            />

                            {/* icon search */}
                            <i className="fas fa-search absolute left-4 top-3 text-gray-400"></i>

                            {/* nút X xoá search */}
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}

                        </div>
                    </div>
                    
                    {/* MENU RIGHT */}
                    <div className="flex items-center space-x-6">
                        <Link to="/products" className="text-gray-600 hover:text-emerald-600 font-medium hidden md:block">
                            Sản phẩm
                        </Link>
                        
                        <div className="relative cursor-pointer text-gray-600 hover:text-emerald-600">
                            <i className="fas fa-shopping-cart text-xl"></i>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                0
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-emerald-600">
                            <i className="fas fa-user-circle text-2xl"></i>
                            <span className="hidden md:block font-medium text-sm">Tài khoản</span>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Header;