import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchAiSummary, fetchReviews, addReviewApi } from '../api/productApi';
import { addToCartApi } from '../api/cartApi';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // States cho Sản phẩm
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');
    
    // States cho Reviews
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    
    // States cho AI
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchProductById(id);
            setProduct(data);
            setMainImage(data.thumbnailUrl);
            
            // Gọi thêm API lấy bình luận
            const reviewData = await fetchReviews(id);
            setReviews(reviewData);
        } catch (err) {
            console.error("Không tìm thấy sản phẩm");
        }
        setLoading(false);
        window.scrollTo(0, 0);
    };

    useEffect(() => { loadData(); }, [id]);

    // XỬ LÝ GIỎ HÀNG
    const handleAddToCart = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để mua hàng!");
            navigate('/login');
            return;
        }

        try {
            await addToCartApi(user.user_id, product.productId, quantity);
            
            // Hiện thông báo đẹp hơn thay vì alert (tùy chọn)
            if(window.confirm(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng! Bạn có muốn đến giỏ hàng ngay không?`)) {
                navigate('/cart');
            }
        } catch (error) {
            alert(error.response?.data || "Lỗi khi thêm vào giỏ hàng!");
        }
    };

    // GỌI AI TÓM TẮT
    const handleSummarize = async () => {
        setIsAiLoading(true);
        setAiSummary('');
        try {
            const summary = await fetchAiSummary(id);
            setAiSummary(summary);
        } catch (error) {
            setAiSummary("Tính năng AI hiện đang bảo trì. Vui lòng thử lại sau.");
        }
        setIsAiLoading(false);
    };

    // GỬI BÌNH LUẬN MỚI
    const submitReview = async (e) => {
        e.preventDefault();
        if(!user) return alert("Bạn cần đăng nhập để đánh giá!");
        
        try {
            const payload = {
                user: { userId: user.user_id },
                rating: newReview.rating,
                comment: newReview.comment
            };
            await addReviewApi(id, payload);
            alert("Cảm ơn bạn đã đánh giá!");
            setShowReviewForm(false);
            setNewReview({ rating: 5, comment: '' });
            loadData(); // Tải lại danh sách bình luận
        } catch (error) {
            alert("Lỗi gửi đánh giá!");
        }
    };

    // Tính điểm trung bình
    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 5.0;

    if (loading) return <div className="text-center py-32 text-emerald-500"><i className="fas fa-spinner fa-spin text-4xl"></i></div>;
    if (!product) return <div className="text-center py-32 font-bold text-2xl text-gray-500">Sản phẩm không tồn tại!</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-3 mb-6">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500">
                    <Link to="/" className="hover:text-emerald-600">Trang chủ</Link> <span className="mx-2">/</span>
                    <Link to="/products" className="hover:text-emerald-600">Sản phẩm</Link> <span className="mx-2">/</span>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                
                {/* CHI TIẾT SẢN PHẨM (Khối 1) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row mb-8 overflow-hidden">
                    {/* Ảnh SP */}
                    <div className="md:w-1/2 p-8 lg:p-12 bg-gray-50 flex flex-col items-center justify-center relative">
                        {/* {product.oldPrice && <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">-20%</div>} */}
                        <img src={mainImage || "https://placehold.co/600x600?text=No+Image"} alt={product.name} className="max-w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500 object-cover aspect-square" />
                    </div>
                    
                    {/* Form Mua hàng */}
                    <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="text-xs text-emerald-600 font-bold tracking-widest uppercase mb-2 bg-emerald-50 w-max px-3 py-1 rounded-full border border-emerald-100">
                            MINIMART MALL
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h2>
                        
                        <div className="flex items-center mb-6 text-sm">
                            <div className="text-yellow-400 mr-2 text-lg">
                                {[...Array(Math.floor(averageRating))].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                            </div>
                            <span className="text-gray-500 font-medium hover:underline cursor-pointer">({reviews.length} đánh giá)</span>
                            <span className="mx-3 text-gray-300">|</span>
                            <span className="text-emerald-600 font-bold"><i class="fas fa-check-circle mr-1"></i> Còn {product.stockQuantity} sản phẩm</span>
                        </div>
                        
                        <div className="flex items-end mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 w-max">
                            <span className="text-4xl font-extrabold text-emerald-600">{product.price.toLocaleString('vi-VN')}đ</span>
                        </div>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed text-base">{product.description || "Đang cập nhật mô tả cho sản phẩm này."}</p>
                        
                        {/* Bộ đếm */}
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden h-12">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 text-gray-500 hover:bg-gray-100 h-full font-bold">-</button>
                                <input type="number" readOnly value={quantity} className="w-14 text-center border-x border-gray-300 h-full focus:outline-none font-bold text-gray-800" />
                                <button onClick={() => quantity < product.stockQuantity ? setQuantity(q => q + 1) : alert("Vượt quá số lượng tồn kho!")} className="px-4 text-gray-500 hover:bg-gray-100 h-full font-bold">+</button>
                            </div>
                            <button onClick={handleAddToCart} className="flex-1 bg-emerald-500 text-white h-12 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg flex items-center justify-center transform hover:-translate-y-0.5">
                                <i className="fas fa-cart-plus mr-2 text-lg"></i> Thêm vào giỏ
                            </button>
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-3">
                            <div className="flex items-center text-sm text-gray-600 font-medium"><div className="w-8 flex justify-center"><i className="fas fa-truck text-emerald-500 text-lg"></i></div> Giao hàng hỏa tốc trong 2h</div>
                            <div className="flex items-center text-sm text-gray-600 font-medium"><div class="w-8 flex justify-center"><i className="fas fa-sync-alt text-blue-500 text-lg"></i></div> Đổi trả miễn phí 100%</div>
                        </div>
                    </div>
                </div>
                
                {/* ĐÁNH GIÁ & AI (Khối 2) */}
                <div className="p-8 lg:p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h3>
                        <button onClick={handleSummarize} disabled={isAiLoading || reviews.length === 0} className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 px-5 py-2.5 rounded-xl font-bold hover:shadow-md transition text-sm flex items-center border border-emerald-200 disabled:opacity-50">
                            {isAiLoading ? <i className="fas fa-spinner fa-spin mr-2 text-emerald-600"></i> : <i className="fas fa-magic mr-2 text-emerald-600"></i>}
                            {isAiLoading ? 'AI đang đọc...' : '✨ Tóm tắt bằng AI'}
                        </button>
                    </div>
                    
                    {/* Khung kết quả AI */}
                    {aiSummary && (
                        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 text-sm text-gray-800 shadow-inner relative fade-in">
                            <div className="absolute -top-3 -left-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100"><span className="text-xl">✨</span></div>
                            <h4 className="font-bold text-emerald-800 mb-2">Google Gemini kết luận:</h4>
                            <div className="whitespace-pre-wrap font-medium text-gray-700 leading-relaxed">{aiSummary}</div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Cột Điểm số */}
                        <div className="md:col-span-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center h-max">
                            <p className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</p>
                            <div className="text-yellow-400 text-xl mb-2">
                                {[...Array(Math.round(averageRating))].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                            </div>
                            <p className="text-gray-500 text-sm">Dựa trên {reviews.length} đánh giá</p>
                            
                            {!showReviewForm && (
                                <button onClick={() => { user ? setShowReviewForm(true) : navigate('/login') }} className="mt-6 w-full border-2 border-emerald-500 text-emerald-600 font-bold py-2 rounded-xl hover:bg-emerald-50 transition">
                                    Viết đánh giá
                                </button>
                            )}
                        </div>

                        {/* Cột Danh sách Comment */}
                        <div className="md:col-span-2 space-y-6">
                            
                            {/* Khung nhập Review */}
                            {showReviewForm && (
                                <form onSubmit={submitReview} className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 mb-6 fade-in">
                                    <h4 className="font-bold mb-3 text-sm">Bạn cảm thấy sản phẩm này thế nào?</h4>
                                    <div className="flex text-yellow-400 mb-4 text-2xl cursor-pointer">
                                        {[1,2,3,4,5].map(star => (
                                            <i key={star} onClick={() => setNewReview({...newReview, rating: star})} className={star <= newReview.rating ? "fas fa-star" : "far fa-star"}></i>
                                        ))}
                                    </div>
                                    <textarea required value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-emerald-500 mb-3 h-24" placeholder="Nhập cảm nhận của bạn về sản phẩm..."></textarea>
                                    <div className="flex justify-end space-x-2">
                                        <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
                                        <button type="submit" className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 shadow-sm">Gửi đánh giá</button>
                                    </div>
                                </form>
                            )}

                            {/* Danh sách */}
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 italic py-4">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                            ) : (
                                reviews.map(rev => (
                                    <div key={rev.reviewId || Math.random()} className="border-b border-gray-100 pb-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold mr-3 uppercase">
                                                {rev.user?.fullName ? rev.user.fullName.charAt(0) : 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{rev.user?.fullName || 'Khách hàng'}</p>
                                                <div className="text-yellow-400 text-xs">
                                                    {[...Array(rev.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg rounded-tl-none inline-block mt-1">
                                            {rev.comment}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;