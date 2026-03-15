import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchAiSummary, fetchReviews, addReviewApi, fetchSimilarProducts } from '../api/productApi';
import { addToCartApi } from '../api/cartApi';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');
    
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    
    const [aiSummary, setAiSummary] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // 🚀 THÊM STATE CHO SẢN PHẨM TƯƠNG TỰ
    const [similarProducts, setSimilarProducts] = useState([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchProductById(id);
            setProduct(data);
            setMainImage(data.thumbnailUrl);
            setQuantity(1); // Reset số lượng về 1 khi qua sản phẩm khác
            
            const reviewData = await fetchReviews(id);
            setReviews(reviewData);

            // 🚀 GỌI API LẤY SẢN PHẨM TƯƠNG TỰ
            const similarData = await fetchSimilarProducts(id);
            setSimilarProducts(similarData);
            
            // Xóa kết quả AI cũ
            setAiSummary('');

        } catch (err) {
            console.error("Không tìm thấy sản phẩm");
        }
        setLoading(false);
        // Cuộn mượt mà lên đầu trang khi chuyển sản phẩm
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Khi URL thay đổi (VD: Click vào sản phẩm tương tự), hàm này sẽ chạy lại
    useEffect(() => { loadData(); }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để mua hàng!");
            navigate('/login');
            return;
        }

        try {
            await addToCartApi(user.user_id, product.productId, quantity);
            window.dispatchEvent(new Event('cartUpdated'));
            if(window.confirm(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng! Đến giỏ hàng ngay?`)) {
                navigate('/cart');
            }
        } catch (error) {
            alert(error.response?.data || "Lỗi khi thêm vào giỏ hàng!");
        }
    };

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
            
            // Chỉ load lại phần review cho mượt
            const reviewData = await fetchReviews(id);
            setReviews(reviewData);
        } catch (error) {
            alert("Lỗi gửi đánh giá!");
        }
    };

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : 5.0;

    const allImages = product ? [
        product.thumbnailUrl, 
        ...(product.images?.map(img => img.imageUrl) || [])
    ].filter(Boolean) : [];

    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + 'đ';

    if (loading) return <div className="text-center py-32 text-emerald-500"><i className="fas fa-spinner fa-spin text-4xl"></i></div>;
    if (!product) return <div className="text-center py-32 font-bold text-2xl text-gray-500">Sản phẩm không tồn tại!</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-16 fade-in">
            
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-3 mb-6">
                <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500">
                    <Link to="/" className="hover:text-emerald-600 transition">Trang chủ</Link> <span className="mx-2">/</span>
                    <Link to="/products" className="hover:text-emerald-600 transition">Sản phẩm</Link> <span className="mx-2">/</span>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 space-y-8">
                
                {/* KHỐI 1: CHI TIẾT SẢN PHẨM */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden">
                    <div className="md:w-1/2 p-6 lg:p-10 bg-white flex flex-col items-center relative border-r border-gray-100">
                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                            <img src={mainImage || "https://placehold.co/600x600"} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in bg-white" />
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto py-2 w-full custom-scrollbar">
                                {allImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setMainImage(img)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImage === img ? 'border-emerald-500 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                        <img src={img} className="w-full h-full object-cover bg-white" alt={`thumb-${idx}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="md:w-1/2 p-6 lg:p-10 flex flex-col justify-center bg-gray-50/30">
                        <div className="text-xs text-emerald-600 font-bold tracking-widest uppercase mb-3 bg-emerald-50 w-max px-3 py-1 rounded-full border border-emerald-100">
                            {product.category?.name || 'MINIMART'}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h2>
                        
                        <div className="flex items-center mb-6 text-sm">
                            <div className="text-yellow-400 mr-2 text-lg">
                                {[...Array(Math.floor(averageRating))].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                            </div>
                            <span className="text-gray-500 font-medium hover:underline cursor-pointer">({reviews.length} đánh giá)</span>
                            <span className="mx-3 text-gray-300">|</span>
                            <span className="text-emerald-600 font-bold"><i className="fas fa-check-circle mr-1"></i> Còn {product.stockQuantity} sản phẩm</span>
                        </div>
                        
                        <div className="flex items-end mb-6">
                            <span className="text-4xl font-extrabold text-red-500">{formatMoney(product.price)}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed text-base">{product.description || "Đang cập nhật mô tả..."}</p>
                        
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden h-14">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-5 text-gray-500 hover:bg-gray-100 hover:text-emerald-600 h-full font-bold text-xl transition">-</button>
                                <input type="number" readOnly value={quantity} className="w-14 text-center border-x border-gray-300 h-full focus:outline-none font-bold text-gray-900 text-lg" />
                                <button onClick={() => quantity < product.stockQuantity ? setQuantity(q => q + 1) : alert("Vượt quá số lượng tồn kho!")} className="px-5 text-gray-500 hover:bg-gray-100 hover:text-emerald-600 h-full font-bold text-xl transition">+</button>
                            </div>
                            <button onClick={handleAddToCart} className="flex-1 bg-emerald-500 text-white h-14 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200 flex items-center justify-center text-lg">
                                <i className="fas fa-cart-plus mr-2 text-xl"></i> Thêm vào giỏ
                            </button>
                        </div>

                        <div className="border-t border-gray-200 pt-6 space-y-3">
                            <div className="flex items-center text-sm text-gray-700 font-medium"><div className="w-8 flex justify-center"><i className="fas fa-truck text-emerald-500 text-lg"></i></div> Giao hàng hỏa tốc trong 2h</div>
                            <div className="flex items-center text-sm text-gray-700 font-medium"><div className="w-8 flex justify-center"><i className="fas fa-sync-alt text-blue-500 text-lg"></i></div> Đổi trả miễn phí 100% (nếu lỗi)</div>
                        </div>
                    </div>
                </div>
                
                {/* KHỐI 2: ĐÁNH GIÁ & AI */}
                <div className="p-6 lg:p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900">Đánh giá từ khách hàng</h3>
                        <button onClick={handleSummarize} disabled={isAiLoading || reviews.length === 0} className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 px-5 py-2.5 rounded-xl font-bold hover:shadow-md transition text-sm flex items-center border border-emerald-200 disabled:opacity-50">
                            {isAiLoading ? <i className="fas fa-spinner fa-spin mr-2 text-emerald-600"></i> : <span className="text-emerald-600 mr-2 text-lg">✨</span>}
                            {isAiLoading ? 'AI đang đọc hàng ngàn bình luận...' : 'Tóm tắt review bằng AI'}
                        </button>
                    </div>
                    
                    {aiSummary && (
                        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 text-sm text-gray-800 shadow-inner relative fade-in">
                            <div className="absolute -top-3 -left-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100"><span className="text-xl">✨</span></div>
                            <h4 className="font-bold text-emerald-800 mb-2">Google Gemini phân tích:</h4>
                            <div className="whitespace-pre-wrap font-medium text-gray-700 leading-relaxed">{aiSummary}</div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center h-max">
                            <p className="text-6xl font-black text-gray-900 mb-3">{averageRating}</p>
                            <div className="text-yellow-400 text-2xl mb-2">
                                {[...Array(Math.round(averageRating))].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Dựa trên {reviews.length} đánh giá</p>
                            
                            {!showReviewForm && (
                                <button onClick={() => { user ? setShowReviewForm(true) : navigate('/login') }} className="mt-8 w-full border-2 border-emerald-500 text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 transition shadow-sm">
                                    Viết đánh giá của bạn
                                </button>
                            )}
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            {showReviewForm && (
                                <form onSubmit={submitReview} className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-6 fade-in">
                                    <h4 className="font-bold mb-4 text-gray-800">Bạn đánh giá sản phẩm này mấy sao?</h4>
                                    <div className="flex text-yellow-400 mb-5 text-3xl cursor-pointer gap-2">
                                        {[1,2,3,4,5].map(star => (
                                            <i key={star} onClick={() => setNewReview({...newReview, rating: star})} className={`transition-transform hover:scale-110 ${star <= newReview.rating ? "fas fa-star" : "far fa-star text-gray-300"}`}></i>
                                        ))}
                                    </div>
                                    <textarea required value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} className="w-full border border-gray-300 rounded-xl p-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 mb-4 h-28" placeholder="Hãy chia sẻ trải nghiệm của bạn về chất lượng sản phẩm, dịch vụ giao hàng..."></textarea>
                                    <div className="flex justify-end space-x-3">
                                        <button type="button" onClick={() => setShowReviewForm(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">Hủy bỏ</button>
                                        <button type="submit" className="px-5 py-2.5 text-sm bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-md shadow-emerald-200 transition">Gửi đánh giá</button>
                                    </div>
                                </form>
                            )}

                            {reviews.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <i className="far fa-comment-dots text-4xl text-gray-300 mb-3"></i>
                                    <p className="text-gray-500 font-medium">Chưa có đánh giá nào. Hãy là người đầu tiên trải nghiệm!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map(rev => (
                                        <div key={rev.reviewId || Math.random()} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                            <div className="flex items-center mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-lg mr-4 uppercase shadow-sm">
                                                    {rev.user?.fullName ? rev.user.fullName.charAt(0) : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{rev.user?.fullName || 'Khách hàng MiniMart'}</p>
                                                    <div className="text-yellow-400 text-xs mt-1">
                                                        {[...Array(rev.rating)].map((_, i) => <i key={i} className="fas fa-star mr-0.5"></i>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm bg-gray-50/80 p-4 rounded-2xl rounded-tl-none inline-block mt-2 border border-gray-100 leading-relaxed">
                                                {rev.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🚀 KHỐI 3: SẢN PHẨM TƯƠNG TỰ (GỢI Ý MUA THÊM) 🚀 */}
                {similarProducts && similarProducts.length > 0 && (
                    <div className="pt-8 pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">Có thể bạn cũng thích</h3>
                            <Link to="/products" className="text-emerald-600 font-bold hover:underline text-sm flex items-center">
                                Xem tất cả <i className="fas fa-chevron-right ml-1 text-xs"></i>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {similarProducts.map((simProd) => (
                                <Link 
                                    to={`/product/${simProd.productId}`} // Link đến chi tiết sản phẩm này
                                    key={simProd.productId} 
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-50 relative">
                                        <img 
                                            src={simProd.thumbnailUrl || 'https://placehold.co/400'} 
                                            alt={simProd.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-white" 
                                        />
                                        {/* Nút xem nhanh chìm */}
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-full text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">Xem chi tiết</span>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-5 flex flex-col flex-grow">
                                        <p className="text-xs text-gray-400 font-medium mb-1 truncate">{simProd.category?.name}</p>
                                        <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{simProd.name}</h4>
                                        <div className="mt-auto pt-2 flex items-center justify-between">
                                            <span className="font-black text-red-500">{formatMoney(simProd.price)}</span>
                                            <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                <i className="fas fa-arrow-right text-sm"></i>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetail;