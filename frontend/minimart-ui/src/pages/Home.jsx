import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomeData } from '../api/homeApi';
import './Home.css'; 

const Home = () => {
    const [data, setData] = useState({ sliders: [], categories: [], featuredProducts: [] });
    const [loading, setLoading] = useState(true);
    
    // State quản lý Slide Banner
    const [currentSlide, setCurrentSlide] = useState(0);

    // State quản lý Phân trang Sản phẩm
    const [productPage, setProductPage] = useState(0);
    const PRODUCTS_PER_PAGE = 8; // Số sản phẩm hiển thị trên 1 trang

    // Lấy dữ liệu từ Backend
    useEffect(() => {
        const loadData = async () => {
            try {
                const homeData = await fetchHomeData();
                setData({
                    sliders: homeData.sliders || [],
                    categories: homeData.categories || [],
                    featuredProducts: homeData.featuredProducts || [] 
                });
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Tự động chuyển Slide Banner mỗi 5 giây
    useEffect(() => {
        if (!data.sliders || data.sliders.length <= 1) return;
        const intervalId = setInterval(() => {
            setCurrentSlide((prevSlide) => prevSlide === data.sliders.length - 1 ? 0 : prevSlide + 1);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [data.sliders]);

    const formatMoney = (amount) => amount.toLocaleString('vi-VN') + 'đ';

    // Tính toán tổng số trang
    const totalProductPages = Math.ceil(data.featuredProducts.length / PRODUCTS_PER_PAGE);
    // Cắt mảng sản phẩm theo trang hiện tại
    const currentProducts = data.featuredProducts.slice(
        productPage * PRODUCTS_PER_PAGE, 
        (productPage + 1) * PRODUCTS_PER_PAGE
    );

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <i className="fas fa-spinner fa-spin text-5xl text-emerald-500 mb-4"></i>
                <span className="text-xl font-bold text-gray-700">Đang chuẩn bị cửa hàng...</span>
            </div>
        );
    }

    const defaultBanner = {
        title: "Siêu thị MiniMart",
        description: "Thực phẩm tươi sạch mỗi ngày - Tích hợp AI",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
    };
    const activeBanner = data.sliders?.length > 0 ? data.sliders[currentSlide] : defaultBanner;

    return (
        <div className="bg-gray-50 min-h-screen pb-16 home-container relative">
            
            {/* ================= 1. HERO BANNER (THIẾT KẾ MỚI ẢNH FULL NỀN) ================= */}
            <div className="max-w-7xl mx-auto px-4 pt-6">
                <div className="relative w-full h-[450px] md:h-[500px] lg:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                    
                    {/* Ảnh nền phủ toàn bộ Slider với hiệu ứng zoom nhẹ */}
                    <img 
                        src={activeBanner.imageUrl} 
                        alt={activeBanner.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600?text=Banner' }}
                    />
                    
                    {/* Lớp phủ đen Gradient để làm nổi bật chữ */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent"></div>

                    {/* Nội dung Banner đè lên trên ảnh */}
                    <div key={currentSlide} className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3 fade-in z-10">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-400/50 bg-emerald-500/20 backdrop-blur-sm mb-6 w-max shadow-sm">
                            <i className="fas fa-bolt text-yellow-400 mr-2 text-sm"></i>
                            <span className="text-emerald-100 font-bold text-xs uppercase tracking-widest">Khuyến Mãi Độc Quyền</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                            {activeBanner.title}
                        </h1>
                        
                        <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed max-w-xl drop-shadow line-clamp-3">
                            {activeBanner.description}
                        </p>
                        
                        <div>
                            <Link to={activeBanner.linkUrl || "/products"} className="inline-flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all">
                                <i className="fas fa-shopping-cart mr-3"></i> Khám phá ngay
                            </Link>
                        </div>
                    </div>

                    {/* Dấu chấm điều hướng Slide nằm gọn bên trong Banner */}
                    {data.sliders?.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
                            {data.sliders.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-emerald-500 w-10 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-white/50 w-2.5 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================= 2. DANH MỤC MUA SẮM ================= */}
            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Danh mục sản phẩm</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                    {data.categories.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">Chưa có danh mục nào.</p>
                    ) : (
                        data.categories.map((cat) => (
                            <Link to={`/products?category=${cat.categoryId}`} key={cat.categoryId} className="category-card group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:border-emerald-200">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 shadow-inner overflow-hidden border-2 border-transparent group-hover:border-emerald-400 transition-colors p-2">
                                    <img 
                                        src={cat.imageUrl || 'https://placehold.co/100?text=No+Img'} 
                                        alt={cat.name} 
                                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100?text=No+Img' }}
                                    />
                                </div>
                                <span className="font-bold text-gray-700 text-sm text-center group-hover:text-emerald-600 transition-colors">{cat.name}</span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* ================= 3. SẢN PHẨM NỔI BẬT ================= */}
            <div className="max-w-7xl mx-auto px-4 mt-20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Gợi ý hôm nay</h2>
                        <p className="text-gray-500 text-sm">Các sản phẩm tươi sạch được chọn lọc</p>
                    </div>
                    
                    <Link to="/products" className="group flex items-center text-emerald-600 font-bold hover:text-emerald-800 transition-colors bg-emerald-50 px-5 py-2.5 rounded-xl shadow-sm hover:bg-emerald-100">
                        Tất cả sản phẩm <i className="fas fa-arrow-right text-sm ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </div>
                
                {currentProducts.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500">Chưa có sản phẩm nổi bật nào.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 fade-in">
                            {currentProducts.map((p) => (
                                <div key={p.productId} className="product-card bg-white rounded-2xl border border-gray-100 overflow-hidden relative flex flex-col h-full hover:shadow-xl transition-shadow group">
                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-md z-10 shadow-md flex items-center">
                                        <i className="fas fa-fire mr-1"></i> Bán chạy
                                    </div>

                                    {/* 🚀 Click vào ảnh để sang trang chi tiết */}
                                    <Link to={`/product/${p.productId}`} className="h-64 overflow-hidden bg-white flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-500">
                                        <img 
                                            src={p.thumbnailUrl || 'https://placehold.co/300?text=No+Image'} 
                                            alt={p.name} 
                                            className="product-img w-full h-full object-contain" 
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300?text=Lỗi+Ảnh' }}
                                        />
                                    </Link>
                                    
                                    <div className="p-5 flex flex-col flex-grow border-t border-gray-50 bg-white relative z-10">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 w-max px-2 py-1 rounded mb-2">
                                            {p.category?.name || "MiniMart"}
                                        </span>
                                        
                                        <Link to={`/product/${p.productId}`}>
                                            <h3 className="font-bold text-gray-800 text-base mb-2 hover:text-emerald-600 transition-colors line-clamp-2">
                                                {p.name}
                                            </h3>
                                        </Link>

                                        <div className="mt-auto pt-4 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 line-through mb-0.5">
                                                    {formatMoney(p.price + p.price * 0.15)}
                                                </span>
                                                <span className="text-xl font-bold text-red-500">
                                                    {formatMoney(p.price)}
                                                </span>
                                            </div>
                                            
                                            {/* 🚀 ĐÃ SỬA: Vẫn giữ icon Giỏ Hàng nhưng bọc trong thẻ Link trỏ về trang Chi Tiết */}
                                            <Link 
                                                to={`/product/${p.productId}`} 
                                                className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors shadow-sm" 
                                                title="Xem chi tiết & Mua hàng"
                                            >
                                                <i className="fas fa-cart-plus text-lg"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Phân trang dưới cùng */}
                        {totalProductPages > 1 && (
                            <div className="flex justify-center items-center space-x-2 mt-10">
                                <button 
                                    disabled={productPage === 0} 
                                    onClick={() => setProductPage(prev => prev - 1)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 shadow-sm disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                
                                {Array.from({ length: totalProductPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setProductPage(i)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${
                                            productPage === i 
                                            ? 'bg-emerald-500 text-white border-transparent' 
                                            : 'bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button 
                                    disabled={productPage >= totalProductPages - 1} 
                                    onClick={() => setProductPage(prev => prev + 1)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 shadow-sm disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;