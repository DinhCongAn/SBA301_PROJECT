import React, { useState, useEffect } from 'react';
import { fetchAdminReviews, deleteAdminReview } from '../../api/adminApi';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Phân trang & Bộ lọc
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState(''); // Rỗng là Tất cả
    const size = 10;

    const loadReviews = async () => {
        setLoading(true);
        try {
            const res = await fetchAdminReviews(page, size, search, ratingFilter);
            setReviews(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (error) {
            console.error("Lỗi lấy danh sách đánh giá:", error);
        }
        setLoading(false);
    };

    // Gọi API mỗi khi page hoặc ratingFilter thay đổi
    useEffect(() => {
        loadReviews();
    }, [page, ratingFilter]);

    // Xử lý tìm kiếm khi bấm Enter hoặc nút Tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0); // Reset về trang 1
        loadReviews();
    };

    // Xóa đánh giá
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
            try {
                await deleteAdminReview(id);
                // Xóa thành công thì tải lại danh sách
                loadReviews();
            } catch (error) {
                alert("Lỗi khi xóa đánh giá!");
            }
        }
    };

    // Hàm vẽ ngôi sao
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className={`fas fa-star text-xs ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
            );
        }
        return <div className="flex space-x-1">{stars}</div>;
    };

    return (
        <div className="fade-in space-y-6 pb-10">
            {/* Header & Bộ lọc */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Quản lý Đánh giá</h2>
                
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Lọc theo sao */}
                    <select 
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        value={ratingFilter}
                        onChange={(e) => {
                            setRatingFilter(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Tất cả số sao</option>
                        <option value="5">5 Sao</option>
                        <option value="4">4 Sao</option>
                        <option value="3">3 Sao</option>
                        <option value="2">2 Sao</option>
                        <option value="1">1 Sao</option>
                    </select>

                    {/* Ô tìm kiếm */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Tìm nội dung, tên SP..." 
                            // Tăng pr-4 lên pr-10 để chừa khoảng trống cho dấu X, tránh chữ bị đè lên icon
                            className="w-full sm:w-64 pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        
                        {/* Nút X (Xóa keyword) - Chỉ hiện khi ô input có chữ */}
                        {search && (
                            <button 
                                type="button" // ⚠️ Bắt buộc phải có type="button" để không bị nhầm thành nút Submit Form
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                                title="Xóa từ khóa"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    
                    <div className="flex space-x-2">
                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm">
                            Lọc
                        </button>
                    </div>
                </form>
            </div>

            {/* Bảng Dữ liệu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 font-medium bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Sản phẩm</th>
                                <th className="px-6 py-4">Đánh giá</th>
                                <th className="px-6 py-4 w-1/3">Nội dung</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10">
                                        <i className="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-400">
                                        Không tìm thấy đánh giá nào
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {review.userName || 'Người dùng ẩn danh'}
                                        </td>
                                        <td className="px-6 py-4 text-emerald-600 font-medium line-clamp-2" title={review.productName}>
                                            {review.productName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <p className="line-clamp-2" title={review.comment}>{review.comment || <span className="text-gray-400 italic">Không có bình luận</span>}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleDelete(review.id)}
                                                className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                                                title="Xóa đánh giá"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Trang <span className="font-bold text-gray-800">{page + 1}</span> / {totalPages}
                        </span>
                        <div className="flex space-x-2">
                            <button 
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                Trước
                            </button>
                            <button 
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page >= totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;