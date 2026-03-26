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

    // Scroll to articles section when hash is present
    useEffect(() => {
        const handleScroll = () => {
            const hash = window.location.hash;
            if (hash === '#articles-section') {
                setTimeout(() => {
                    const element = document.getElementById('articles-section');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        };

        // Gọi lần đầu khi component mount
        handleScroll();

        // Lắng nghe sự thay đổi hash
        window.addEventListener('hashchange', handleScroll);

        return () => {
            window.removeEventListener('hashchange', handleScroll);
        };
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

    // Dữ liệu bài viết mẫu
    const articles = [
        {
            id: 1,
            title: "Cách chọn rau củ tươi ngon tại siêu thị",
            excerpt: "Hướng dẫn chi tiết cách nhận biết rau củ tươi, đảm bảo an toàn thực phẩm.",
            image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400",
            content: `
                <h2>Cách chọn rau củ tươi ngon</h2>
                <p>Khi mua rau củ tại siêu thị MiniMart, bạn cần chú ý đến những dấu hiệu sau để chọn được sản phẩm tươi ngon nhất:</p>
                <ul>
                    <li><strong>Màu sắc tự nhiên:</strong> Rau củ tươi thường có màu sắc tươi sáng, không bị úa vàng.</li>
                    <li><strong>Cấu trúc chắc chắn:</strong> Sờ vào phải cảm nhận được độ cứng, không mềm nhũn.</li>
                    <li><strong>Không có vết thâm:</strong> Tránh những quả có vết đốm đen hoặc thâm tím.</li>
                </ul>
                <p>Tại MiniMart, chúng tôi cam kết cung cấp rau củ được kiểm định chất lượng, nhập trực tiếp từ nông trại uy tín.</p>
                <h3>Lợi ích của rau củ tươi</h3>
                <p>Rau củ tươi chứa nhiều vitamin và khoáng chất thiết yếu cho cơ thể, giúp tăng cường sức khỏe và ngăn ngừa bệnh tật.</p>
            `
        },
        {
            id: 2,
            title: "Top 10 thực phẩm hữu cơ tốt cho sức khỏe",
            excerpt: "Khám phá những thực phẩm hữu cơ hàng đầu giúp cải thiện sức khỏe hàng ngày.",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
            content: `
                <h2>Top 10 thực phẩm hữu cơ</h2>
                <p>Thực phẩm hữu cơ tại MiniMart được nuôi trồng không sử dụng hóa chất, đảm bảo an toàn tuyệt đối:</p>
                <ol>
                    <li><strong>Bơ hữu cơ:</strong> Chứa nhiều chất béo tốt cho tim mạch.</li>
                    <li><strong>Cà chua organic:</strong> Giàu lycopene, tốt cho da và mắt.</li>
                    <li><strong>Táo organic:</strong> Cung cấp fiber và vitamin C dồi dào.</li>
                    <li><strong>Gà ta thả vườn:</strong> Thịt dai, ít mỡ, giàu protein.</li>
                    <li><strong>Mật ong nguyên chất:</strong> Kháng sinh tự nhiên, tốt cho tiêu hóa.</li>
                    <li><strong>Trái cây nhiệt đới:</strong> Kiwi, xoài, dứa organic tươi ngon.</li>
                    <li><strong>Rau lá xanh:</strong> Rau bina, cải xoăn giàu sắt và folate.</li>
                    <li><strong>Hạt dinh dưỡng:</strong> Hạnh nhân, óc chó, hạt chia organic.</li>
                    <li><strong>Sữa organic:</strong> Không kháng sinh, tốt cho trẻ em.</li>
                    <li><strong>Gạo lứt organic:</strong> Giàu chất xơ, hỗ trợ giảm cân.</li>
                </ol>
                <p>MiniMart cam kết nguồn gốc rõ ràng cho tất cả sản phẩm hữu cơ.</p>
            `
        },
        {
            id: 3,
            title: "Bí quyết nấu ăn với nguyên liệu tươi",
            excerpt: "Mẹo hay để giữ trọn vẹn dinh dưỡng khi chế biến thực phẩm.",
            image: "https://www.lorca.vn/wp-content/uploads/2022/02/Bi-quyet-nau-an-5-1536x1024.jpg",
            content: `
                <h2>Bí quyết nấu ăn với nguyên liệu tươi</h2>
                <p>Để giữ trọn vẹn dinh dưỡng từ thực phẩm tươi, hãy áp dụng những bí quyết sau:</p>
                <h3>Chuẩn bị nguyên liệu</h3>
                <ul>
                    <li>Rửa rau củ dưới nước chảy, ngâm nước muối loãng 10 phút.</li>
                    <li>Cắt rau ngay trước khi nấu để tránh oxy hóa vitamin C.</li>
                    <li>Thịt cá nên ướp gia vị trước 15-30 phút.</li>
                </ul>
                <h3>Phương pháp nấu</h3>
                <ul>
                    <li><strong>Hấp:</strong> Giữ nguyên 90% dinh dưỡng, phù hợp rau củ.</li>
                    <li><strong>Luộc:</strong> Thêm chút muối, nước sôi mới cho thực phẩm vào.</li>
                    <li><strong>Xào:</strong> Dùng dầu olive, nhiệt độ cao, đảo nhanh.</li>
                </ul>
                <p>Tại MiniMart, chúng tôi có khu vực demo nấu ăn để bạn học hỏi thêm.</p>
            `
        },
        {
            id: 4,
            title: "Khuyến mãi tháng này tại MiniMart",
            excerpt: "Đừng bỏ lỡ những ưu đãi hấp dẫn trong tháng này với giảm giá lên đến 50%.",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
            content: `
                <h2>Khuyến mãi tháng này</h2>
                <p>MiniMart mang đến chương trình khuyến mãi đặc biệt với hàng ngàn ưu đãi:</p>
                <h3>Giảm giá sản phẩm</h3>
                <ul>
                    <li><strong>Rau củ quả:</strong> Giảm 20% cho đơn hàng từ 200k</li>
                    <li><strong>Thịt cá tươi:</strong> Mua 2 tặng 1 cho các loại thịt gà</li>
                    <li><strong>Sản phẩm hữu cơ:</strong> Giảm 30% cho thành viên VIP</li>
                </ul>
                <h3>Ưu đãi đặc biệt</h3>
                <ul>
                    <li>Tích điểm đổi quà: Mỗi 100k tích 10 điểm</li>
                    <li>Miễn phí giao hàng cho đơn từ 300k</li>
                    <li>Flash sale hàng tuần vào thứ 3, 5, 7</li>
                </ul>
                <p>Đăng ký thẻ thành viên ngay để nhận ưu đãi độc quyền!</p>
            `
        },
        {
            id: 5,
            title: "Hướng dẫn mua sắm online an toàn",
            excerpt: "Mẹo để mua sắm trực tuyến tại MiniMart một cách an toàn và thuận tiện.",
            image: "https://media.anhp.vn/files/2025/09MH%20138.png",
            content: `
                <h2>Mua sắm online an toàn</h2>
                <p>MiniMart đảm bảo trải nghiệm mua sắm trực tuyến tuyệt vời với những tính năng bảo mật:</p>
                <h3>Bước đặt hàng</h3>
                <ol>
                    <li>Chọn sản phẩm và thêm vào giỏ hàng</li>
                    <li>Kiểm tra lại đơn hàng và thông tin giao hàng</li>
                    <li>Chọn phương thức thanh toán an toàn</li>
                    <li>Xác nhận và theo dõi đơn hàng</li>
                </ol>
                <h3>Tính năng bảo mật</h3>
                <ul>
                    <li>Mã hóa SSL 256-bit cho mọi giao dịch</li>
                    <li>Hỗ trợ thanh toán qua VNPay, Momo, ZaloPay</li>
                    <li>Đội ngũ chăm sóc khách hàng 24/7</li>
                    <li>Chính sách đổi trả trong 7 ngày</li>
                </ul>
                <p>Tải app MiniMart để nhận ưu đãi giao hàng miễn phí!</p>
            `
        },
        {
            id: 6,
            title: "Lợi ích của việc ăn uống lành mạnh tại MiniMart",
            excerpt: "Khám phá cách thức ăn uống lành mạnh giúp cải thiện cuộc sống và tại sao MiniMart là lựa chọn hoàn hảo.",
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
            content: `
                <h2>Lợi ích của việc ăn uống lành mạnh</h2>
                <p>Ăn uống lành mạnh không chỉ giúp duy trì sức khỏe mà còn cải thiện chất lượng cuộc sống. Tại MiniMart, chúng tôi cung cấp những sản phẩm tươi ngon, an toàn để hỗ trợ lối sống này.</p>
                <h3>Các lợi ích chính</h3>
                <ul>
                    <li><strong>Tăng cường năng lượng:</strong> Thực phẩm tươi cung cấp dưỡng chất cần thiết, giúp bạn tràn đầy sức sống.</li>
                    <li><strong>Hỗ trợ giảm cân:</strong> Rau củ quả ít calo, giàu chất xơ giúp kiểm soát cân nặng hiệu quả.</li>
                    <li><strong>Củng cố hệ miễn dịch:</strong> Vitamin và khoáng chất từ thực phẩm organic tăng cường đề kháng.</li>
                    <li><strong>Cải thiện tâm trạng:</strong> Chế độ ăn cân bằng giúp giảm stress và cải thiện giấc ngủ.</li>
                    <li><strong>Ngăn ngừa bệnh tật:</strong> Giảm nguy cơ mắc các bệnh mãn tính như tim mạch, tiểu đường.</li>
                </ul>
                <h3>Mẹo ăn uống lành mạnh tại MiniMart</h3>
                <p>Hãy bắt đầu bằng cách:</p>
                <ol>
                    <li>Chọn rau củ theo mùa để đảm bảo tươi ngon và dinh dưỡng tối ưu.</li>
                    <li>Kết hợp protein nạc từ thịt gà, cá với rau xanh trong mỗi bữa ăn.</li>
                    <li>Uống đủ 2 lít nước lọc mỗi ngày, có thể thêm chanh hoặc bạc hà.</li>
                    <li>Ăn sáng đầy đủ để cung cấp năng lượng cho cả ngày.</li>
                    <li>Giới hạn đồ chiên rán, ưu tiên hấp, luộc hoặc nướng.</li>
                </ol>
                <p>MiniMart không chỉ bán thực phẩm mà còn là người bạn đồng hành trên hành trình sống khỏe. Hãy ghé thăm chúng tôi để khám phá thêm các sản phẩm hữu cơ và nhận tư vấn dinh dưỡng miễn phí!</p>
            `
        }
    ];

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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Danh mục sản phẩm</h2>
                        <p className="text-gray-500 text-sm">Sản phẩm giúp sắp xếp đồ đạc gọn gàng, tiện lợi</p>
                    </div>
                    
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

            {/* ================= 4. BÀI VIẾT HỮU ÍCH ================= */}
            <div id="articles-section" className="max-w-7xl mx-auto px-4 mt-20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Bài viết hữu ích</h2>
                        <p className="text-gray-500 text-sm">Kiến thức và mẹo hay về thực phẩm tươi sạch</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/article/${article.id}`}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow block"
                        >
                            <div className="h-48 overflow-hidden">
                                <img 
                                    src={article.image} 
                                    alt={article.title} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-gray-800 text-lg mb-3 hover:text-emerald-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {article.excerpt}
                                </p>
                                <div className="mt-4 flex items-center text-emerald-600 font-medium">
                                    <span>Đọc thêm</span>
                                    <i className="fas fa-arrow-right ml-2 text-sm"></i>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;