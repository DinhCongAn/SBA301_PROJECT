import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../api/cartApi';
import { fetchCategories } from '../api/productApi';

// Thêm thư viện WebSocket và Toastify
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [cartCount, setCartCount] = useState(0);

    // ========================================================
    // QUẢN LÝ DANH MỤC (CATEGORIES DROPDOWN)
    // ========================================================
    const [categories, setCategories] = useState([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);

    // Tải danh sách danh mục
    useEffect(() => {
        const loadCategories = async () => {
            const cats = await fetchCategories();
            setCategories(cats);
        };
        loadCategories();
    }, []);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Xử lý khi click vào danh mục
    const handleCategoryClick = (categoryId) => {
        navigate(`/products?category=${categoryId}`);
        setIsCategoryDropdownOpen(false);
    };

    // ========================================================
    // QUẢN LÝ THÔNG BÁO (NOTIFICATIONS)
    // ========================================================
    const [notifications, setNotifications] = useState([]);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [unreadNotiCount, setUnreadNotiCount] = useState(0);
    const notiDropdownRef = useRef(null);

    // Bắt sự kiện click ra ngoài để đóng hộp thông báo
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notiDropdownRef.current && !notiDropdownRef.current.contains(event.target)) {
                setIsNotiOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // KẾT NỐI WEBSOCKET & ĐẶT MÁY TEST
    useEffect(() => {
        let stompClient = null;

        if (user) {
            // Lấy lại danh sách thông báo cũ từ LocalStorage
            const savedNotis = JSON.parse(localStorage.getItem(`notis_${user.user_id}`)) || [];
            setNotifications(savedNotis);
            setUnreadNotiCount(savedNotis.filter(n => !n.isRead).length);

            // Khởi tạo kết nối
            stompClient = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                reconnectDelay: 5000,
            });

            stompClient.onConnect = () => {
                console.log(`✅ User ${user.user_id} đã kết nối Trạm thông báo!`);

                // Lắng nghe kênh của User
                stompClient.subscribe(`/topic/user/${user.user_id}/notifications`, (message) => {

                    console.log("=========================================");
                    console.log("🚨 CÓ TIN TING TING TỪ BACKEND GỬI VỀ!");
                    console.log("1. Dữ liệu thô (Raw Message):", message);
                    console.log("2. Phần Body (Message Body):", message.body);
                    console.log("=========================================");

                    try {
                        // Cố gắng dịch nó ra JSON
                        const newNoti = JSON.parse(message.body);
                        console.log("✅ 3. Dịch JSON THÀNH CÔNG, dữ liệu là:", newNoti);

                        const notiObj = {
                            ...newNoti,
                            id: Date.now(), // Tạo ID duy nhất cho thẻ React
                            isRead: false
                        };

                        // 1. Hiển thị Popup Toast ở góc phải
                        showCustomerToast(notiObj);

                        // 2. Cập nhật vào danh sách Dropdown & LocalStorage
                        setNotifications(prev => {
                            const updatedNotis = [notiObj, ...prev].slice(0, 10); // Giữ 10 tin mới nhất
                            localStorage.setItem(`notis_${user.user_id}`, JSON.stringify(updatedNotis));
                            return updatedNotis;
                        });
                        setUnreadNotiCount(prev => prev + 1);

                    } catch (error) {
                        console.error("❌ LỖI NGHIÊM TRỌNG: Backend gửi về nhưng không parse JSON được!");
                        console.error("Chi tiết lỗi:", error);
                    }
                });
            };

            stompClient.activate();
        }

        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, [user?.user_id]);

    // ========================================================
    // GIAO DIỆN & UI THÔNG BÁO
    // ========================================================
    const showCustomerToast = (noti) => {
        const CustomerToast = () => (
            <div className="cursor-pointer" onClick={() => handleNotiClick(noti)}>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shrink-0">
                        <i className="fas fa-box-open text-blue-500 text-lg"></i>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-sm mb-1">Cập nhật đơn hàng!</p>
                        <p className="text-sm text-gray-600 leading-snug">{noti.message}</p>
                    </div>
                </div>
            </div>
        );

        toast.info(<CustomerToast />, {
            position: "bottom-right",
            autoClose: 8000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            theme: "light",
            style: { borderLeft: '5px solid #3b82f6', borderRadius: '10px' }
        });
    };

    const handleNotiClick = (noti) => {
        const updatedNotis = notifications.map(n => n.id === noti.id ? { ...n, isRead: true } : n);
        setNotifications(updatedNotis);
        setUnreadNotiCount(updatedNotis.filter(n => !n.isRead).length);
        localStorage.setItem(`notis_${user.user_id}`, JSON.stringify(updatedNotis));

        setIsNotiOpen(false);
        navigate('/orders');
    };

    const markAllAsRead = () => {
        const updatedNotis = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updatedNotis);
        setUnreadNotiCount(0);
        localStorage.setItem(`notis_${user.user_id}`, JSON.stringify(updatedNotis));
    };

    const timeAgo = (timestamp) => {
        if (!timestamp) return "Vừa xong";
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return "Vừa xong";
        if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
        return `${Math.floor(seconds / 86400)} ngày trước`;
    };

    // ========================================================
    // CÁC HÀM CŨ KHÁC
    // ========================================================
    const fetchCartCount = async () => {
        if (user) {
            try {
                const res = await getCart(user.user_id);
                const totalItems = res.data.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(totalItems);
            } catch (error) { console.error("Lỗi tải giỏ hàng", error); }
        } else setCartCount(0);
    };

    useEffect(() => {
        fetchCartCount();
        window.addEventListener('cartUpdated', fetchCartCount);
        return () => window.removeEventListener('cartUpdated', fetchCartCount);
    }, [user?.user_id]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleCartClick = () => {
        if (!user) {
            alert("Vui lòng đăng nhập để xem giỏ hàng!");
            navigate('/login');
        } else {
            navigate('/cart');
        }
    };

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('user');
            setCartCount(0);
            navigate('/');
        }
    };

    // ========================================================
    // RENDER GIAO DIỆN
    // ========================================================
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-40">
            {/* THẺ TOAST NẰM ĐÂY */}
            <ToastContainer style={{ zIndex: 99999 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center cursor-pointer">
                        <i className="fas fa-shopping-basket text-emerald-500 text-2xl mr-2"></i>
                        <span className="font-bold text-xl tracking-tight text-gray-900">MiniMart</span>
                    </Link>

                    {/* TÌM KIẾM */}
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

                    {/* MENU PHẢI */}
                    <div className="flex items-center space-x-5 sm:space-x-6">
                        {/* DROPDOWN DANH MỤC */}
                        <div
                            className="relative py-4" /* Thêm padding (py-4) để tạo vùng đệm hover an toàn, giúp chuột không bị trượt ra ngoài khi di chuyển xuống menu */
                            ref={categoryDropdownRef}
                            onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                            onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                        >
                            <button
                                onClick={() => navigate('/products')} /* Đổi thành chuyển hướng luôn, vì giờ đã dùng hover để mở menu */
                                className="text-gray-600 hover:text-emerald-600 font-medium hidden md:flex items-center gap-1 hover:bg-emerald-50 px-3 py-1 rounded transition-colors"
                            >
                                <i className="fas fa-th-large text-sm"></i>
                                Danh mục
                                <i className={`fas fa-chevron-down text-xs transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {isCategoryDropdownOpen && (
                                /* Thêm top-10 hoặc điều chỉnh mt-* để menu không bị đè lên vùng padding của nút */
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        <button
                                            onClick={() => {
                                                navigate('/products');
                                                setIsCategoryDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border-b border-gray-100 font-medium"
                                        >
                                            <i className="fas fa-th text-sm mr-2.5"></i>
                                            Tất cả sản phẩm
                                        </button>
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <button
                                                    key={cat.categoryId}
                                                    onClick={() => handleCategoryClick(cat.categoryId)}
                                                    className="w-full text-left px-4 py-2.5 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center gap-2"
                                                >
                                                    <i className="fas fa-folder text-xs text-emerald-500"></i>
                                                    {cat.name}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                                Đang tải danh mục...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/products" className="text-gray-600 hover:text-emerald-600 font-medium hidden md:block">Sản phẩm</Link>

                        {user && user.role === 'ADMIN' && (
                            <Link to="/admin" className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-100 transition border border-emerald-200 hidden md:flex">
                                <i className="fas fa-user-shield"></i> Quản trị
                            </Link>
                        )}

                        {/* CHUÔNG THÔNG BÁO */}
                        {user && (
                            <div className="relative" ref={notiDropdownRef}>
                                <button
                                    onClick={() => setIsNotiOpen(!isNotiOpen)}
                                    className="relative text-gray-600 hover:text-blue-500 focus:outline-none p-1 mt-1"
                                >
                                    <i className="fas fa-bell text-xl"></i>
                                    {unreadNotiCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white animate-pulse">
                                            {unreadNotiCount > 9 ? '9+' : unreadNotiCount}
                                        </span>
                                    )}
                                </button>

                                {isNotiOpen && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down">
                                        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                                            <h3 className="font-bold text-gray-800">Thông báo</h3>
                                            {unreadNotiCount > 0 && (
                                                <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline font-medium">Đánh dấu đã đọc</button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-gray-500 text-sm">
                                                    <i className="far fa-bell-slash text-3xl mb-2 text-gray-300"></i>
                                                    <p>Bạn chưa có thông báo nào.</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-gray-50">
                                                    {notifications.map((noti) => (
                                                        <div
                                                            key={noti.id}
                                                            onClick={() => handleNotiClick(noti)}
                                                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${!noti.isRead ? 'bg-blue-50/30' : ''}`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${!noti.isRead ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
                                                                <i className="fas fa-box"></i>
                                                            </div>
                                                            <div>
                                                                <p className={`text-sm ${!noti.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{noti.message}</p>
                                                                <p className="text-xs text-gray-400 mt-1">{timeAgo(noti.time)}</p>
                                                            </div>
                                                            {!noti.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                                            <Link to="/orders" onClick={() => setIsNotiOpen(false)} className="text-sm font-medium text-gray-600 hover:text-emerald-600">Xem tất cả đơn hàng</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* GIỎ HÀNG */}
                        <div onClick={handleCartClick} className="relative cursor-pointer text-gray-600 hover:text-emerald-600 p-1 mt-1">
                            <i className="fas fa-shopping-cart text-xl"></i>
                            {user && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </div>

                        {/* USER DROP DOWN */}
                        {user ? (
                            <div className="relative group cursor-pointer py-4">
                                <div className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold uppercase">
                                            {user.full_name ? user.full_name.charAt(0) : 'U'}
                                        </div>
                                    )}
                                    <span className="hidden md:block font-medium text-sm truncate max-w-[100px]">
                                        {user.full_name || user.username}
                                    </span>
                                </div>

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