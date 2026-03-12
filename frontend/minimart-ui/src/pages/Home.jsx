import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomeData } from '../api/homeApi';
import './Home.css'; 

const Home = () => {
    const [data, setData] = useState({ sliders: [], categories: [], featuredProducts: [] });
    const [loading, setLoading] = useState(true);
    
    // 1. THÊM STATE ĐỂ QUẢN LÝ SLIDE ĐANG HIỂN THỊ
    const [currentSlide, setCurrentSlide] = useState(0);

    const categoryStyles = [
        { icon: "fa-apple-alt", color: "text-red-500", bg: "bg-red-50" }, 
        { icon: "fa-carrot", color: "text-orange-500", bg: "bg-orange-50" }, 
        { icon: "fa-fish", color: "text-blue-500", bg: "bg-blue-50" }, 
        { icon: "fa-egg", color: "text-yellow-500", bg: "bg-yellow-50" },
        { icon: "fa-wine-bottle", color: "text-purple-500", bg: "bg-purple-50" },
        { icon: "fa-pepper-hot", color: "text-red-600", bg: "bg-red-50" } 
    ];

    // Lấy dữ liệu từ Backend
    useEffect(() => {
        const loadData = async () => {
            try {
                const homeData = await fetchHomeData();
                setData(homeData);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 2. LOGIC TỰ ĐỘNG CHUYỂN SLIDE MỖI 5 GIÂY
    useEffect(() => {
        // Nếu không có slider hoặc chỉ có 1 cái thì không cần chạy hiệu ứng
        if (!data.sliders || data.sliders.length <= 1) return;

        const intervalId = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                // Nếu đang ở slide cuối cùng thì quay lại 0, ngược lại thì +1
                prevSlide === data.sliders.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000);

        // Cleanup function: Xóa bộ đếm khi component unmount để tránh Memory Leak (Rò rỉ bộ nhớ)
        return () => clearInterval(intervalId);
    }, [data.sliders]);

    const formatMoney = (amount) => amount.toLocaleString('vi-VN') + 'đ';

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <i className="fas fa-spinner fa-spin text-5xl text-emerald-500 mb-4"></i>
                <span className="text-xl font-bold text-gray-700">Đang chuẩn bị cửa hàng...</span>
            </div>
        );
    }

    // 3. LẤY BANNER THEO VỊ TRÍ CURRENT SLIDE
    const defaultBanner = {
        title: "Siêu thị MiniMart",
        description: "Thực phẩm tươi sạch mỗi ngày - Tích hợp AI",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
    };
    const activeBanner = data.sliders?.length > 0 ? data.sliders[currentSlide] : defaultBanner;

    return (
        <div className="bg-gray-50 min-h-screen pb-16 home-container">
            
            {/* ================= 1. HERO BANNER ================= */}
            <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 pt-16 pb-20 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-200 opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-200 opacity-50 blur-3xl"></div>

                {/* Khung chứa nội dung Banner. Thêm key để React biết nó thay đổi và kích hoạt lại hiệu ứng mượt */}
                <div key={currentSlide} className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center relative z-10 fade-in">
                    <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-10 text-center md:text-left">
                        <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-yellow-200">
                            <i className="fas fa-bolt text-yellow-500 mr-2 text-lg"></i>
                            <span className="text-emerald-700 font-bold text-sm uppercase tracking-wider">Khuyến Mãi Độc Quyền</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 transition-all">
                            {activeBanner.title}
                        </h1>
                        <p className="text-gray-600 mb-8 text-lg md:text-xl leading-relaxed">
                            {activeBanner.description}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            {/* Nút bấm có gắn link_url từ Database (nếu có) */}
                            <Link to={activeBanner.linkUrl || "/products"} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-emerald-500/40 transition-all flex items-center">
                                <i className="fas fa-shopping-basket mr-3 text-xl"></i> Mua sắm ngay
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img 
                            src={activeBanner.imageUrl} 
                            alt={activeBanner.title} 
                            className="rounded-[2rem] shadow-2xl object-cover h-64 md:h-[400px] w-full max-w-lg banner-img-float border-4 border-white transition-opacity duration-500" 
                        />
                    </div>
                </div>

                {/* 4. CÁC DẤU CHẤM (DOTS) CHỈ THỊ VỊ TRÍ SLIDE */}
                {data.sliders?.length > 1 && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
                        {data.sliders.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-3 rounded-full transition-all duration-300 ${
                                    currentSlide === index ? 'bg-emerald-500 w-10 shadow-md' : 'bg-emerald-200 w-3 hover:bg-emerald-400'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ================= 2. DANH MỤC MUA SẮM ================= */}
            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Danh mục sản phẩm</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                    {data.categories.map((cat, index) => {
                        const style = categoryStyles[index % categoryStyles.length];
                        return (
                            <Link to={`/products?category=${cat.categoryId}`} key={cat.categoryId} className="category-card flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100">
                                <div className={`w-16 h-16 rounded-full ${style.bg} ${style.color} flex items-center justify-center text-3xl mb-4 shadow-inner`}>
                                    <i className={`fas ${style.icon}`}></i>
                                </div>
                                <span className="font-bold text-gray-700 text-sm text-center">{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ================= 3. SẢN PHẨM NỔI BẬT ================= */}
            <div className="max-w-7xl mx-auto px-4 mt-20">
                <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Gợi ý hôm nay</h2>
                        <p className="text-gray-500 text-sm">Các sản phẩm tươi sạch được chọn lọc</p>
                    </div>
                    <Link to="/products" className="group flex items-center text-emerald-600 font-bold hover:text-emerald-800 transition-colors bg-emerald-50 px-4 py-2 rounded-lg">
                        Xem tất cả <i className="fas fa-arrow-right text-sm ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {data.featuredProducts.map((p) => (
                        <div key={p.productId} className="product-card bg-white rounded-2xl border border-gray-100 overflow-hidden relative flex flex-col h-full">
                            
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-md z-10 shadow-md flex items-center">
                                <i className="fas fa-fire mr-1"></i> Bán chạy
                            </div>

                            <Link to={`/product/${p.productId}`} className="h-56 overflow-hidden bg-white flex items-center justify-center p-4">
                                <img 
                                    src={p.thumbnailUrl} 
                                    alt={p.name} 
                                    className="product-img w-full h-full object-contain transition-transform duration-500" 
                                />
                            </Link>
                            
                            <div className="p-5 flex flex-col flex-grow border-t border-gray-50">
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
                                    <button 
                                        className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                                        title="Thêm vào giỏ"
                                    >
                                        <i className="fas fa-cart-plus text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Home;