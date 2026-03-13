import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api/productApi';

const ProductList = () => {
    // 1. Lấy tham số từ thanh URL (nếu có tìm kiếm từ Header)
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('search'); 

    // 2. Các State quản lý Bộ lọc
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
    const [priceRange, setPriceRange] = useState('all'); // 'all', 'under50', '50to200', 'over200'
    const [sortOption, setSortOption] = useState('newest'); // 'newest', 'price_asc', 'price_desc'
    
    // 3. Các State quản lý Dữ liệu và Phân trang
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);

    // Tải danh sách Danh mục cho Sidebar khi load trang
    useEffect(() => {
        const loadCategories = async () => {
            const cats = await fetchCategories();
            setCategories(cats);
        };
        loadCategories();
    }, []);

    // Reset về trang 1 khi người dùng đổi bất kỳ bộ lọc nào
    useEffect(() => {
        setCurrentPage(0);
    }, [keyword, selectedCategory, priceRange, sortOption]);

    // Gọi API lấy Sản phẩm
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            
            // Xử lý khoảng giá
            let minPrice = null;
            let maxPrice = null;
            if (priceRange === 'under50') maxPrice = 50000;
            if (priceRange === '50to200') { minPrice = 50000; maxPrice = 200000; }
            if (priceRange === 'over200') minPrice = 200000;

            const filters = {
                search: keyword,
                categoryId: selectedCategory === 'all' ? null : selectedCategory,
                minPrice, maxPrice,
                sort: sortOption,
                page: currentPage,
                size: 9
            };

            const data = await fetchProducts(filters);
            setProducts(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        loadProducts();
    }, [keyword, selectedCategory, priceRange, sortOption, currentPage]);

    const formatMoney = (amount) => amount.toLocaleString('vi-VN') + 'đ';

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 fade-in">
            
            {/* Tiêu đề trang kết quả tìm kiếm */}
            {keyword && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm cho: "{keyword}"</h1>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* ================= CỘT TRÁI: SIDEBAR LỌC ================= */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        
                        {/* Lọc Danh mục */}
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Danh mục</h3>
                        <ul className="space-y-3 text-gray-600">
                            <li>
                                <button 
                                    onClick={() => setSelectedCategory(null)}
                                    className={`text-left w-full hover:text-emerald-600 transition-colors ${!selectedCategory ? 'text-emerald-600 font-bold' : ''}`}
                                >
                                    Tất cả sản phẩm
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.categoryId}>
                                    <button 
                                        onClick={() => setSelectedCategory(cat.categoryId.toString())}
                                        className={`text-left w-full hover:text-emerald-600 transition-colors ${selectedCategory === cat.categoryId.toString() ? 'text-emerald-600 font-bold' : ''}`}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Lọc Khoảng giá */}
                        <h3 className="font-bold text-lg mt-8 mb-4 text-gray-800">Khoảng giá</h3>
                        <div className="space-y-3 text-gray-600">
                            <label className="flex items-center cursor-pointer hover:text-emerald-600">
                                <input type="radio" name="price" value="all" checked={priceRange === 'all'} onChange={(e) => setPriceRange(e.target.value)} className="mr-3 w-4 h-4 text-emerald-500 focus:ring-emerald-500" /> 
                                Tất cả mức giá
                            </label>
                            <label className="flex items-center cursor-pointer hover:text-emerald-600">
                                <input type="radio" name="price" value="under50" checked={priceRange === 'under50'} onChange={(e) => setPriceRange(e.target.value)} className="mr-3 w-4 h-4 text-emerald-500 focus:ring-emerald-500" /> 
                                Dưới 50.000đ
                            </label>
                            <label className="flex items-center cursor-pointer hover:text-emerald-600">
                                <input type="radio" name="price" value="50to200" checked={priceRange === '50to200'} onChange={(e) => setPriceRange(e.target.value)} className="mr-3 w-4 h-4 text-emerald-500 focus:ring-emerald-500" /> 
                                50.000đ - 200.000đ
                            </label>
                            <label className="flex items-center cursor-pointer hover:text-emerald-600">
                                <input type="radio" name="price" value="over200" checked={priceRange === 'over200'} onChange={(e) => setPriceRange(e.target.value)} className="mr-3 w-4 h-4 text-emerald-500 focus:ring-emerald-500" /> 
                                Trên 200.000đ
                            </label>
                        </div>

                    </div>
                </div>

                {/* ================= CỘT PHẢI: LƯỚI SẢN PHẨM ================= */}
                <div className="flex-1">
                    
                    {/* Thanh công cụ phía trên Lưới sản phẩm */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-4 sm:mb-0">
                            Hiển thị <span className="font-bold text-emerald-600">{totalElements}</span> sản phẩm
                        </p>
                        
                        {/* Dropdown Sắp xếp */}
                        <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 p-2.5 border bg-gray-50 outline-none w-full sm:w-auto cursor-pointer"
                        >
                            <option value="newest">Sắp xếp: Mới nhất</option>
                            <option value="price_asc">Giá: Thấp đến cao</option>
                            <option value="price_desc">Giá: Cao đến thấp</option>
                        </select>
                    </div>

                    {/* Hiển thị Dữ liệu */}
                    {loading ? (
                        <div className="flex justify-center items-center py-32 text-emerald-500">
                            <i className="fas fa-spinner fa-spin text-4xl"></i>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                            <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                            <h2 className="text-xl text-gray-600 font-bold mb-2">Không tìm thấy sản phẩm phù hợp!</h2>
                            <p className="text-gray-500">Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm nhé.</p>
                            <button onClick={() => {setSelectedCategory(null); setPriceRange('all'); setSortOption('newest');}} className="mt-6 text-emerald-600 font-bold hover:underline">
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((p) => (
                                    <div key={p.productId} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col hover:shadow-lg transition-all duration-300">
                                        <Link to={`/product/${p.productId}`} className="h-48 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center mb-3">
                                            <img src={p.thumbnailUrl} alt={p.name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </Link>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 w-max px-2 py-1 rounded mb-2">
                                            {p.category?.name || "MiniMart"}
                                        </span>
                                        <Link to={`/product/${p.productId}`}>
                                            <h3 className="font-bold text-gray-800 text-sm mb-1 hover:text-emerald-600 line-clamp-2">{p.name}</h3>
                                        </Link>
                                        <div className="mt-auto pt-3 flex justify-between items-center">
                                            <span className="text-emerald-600 font-bold text-lg">{formatMoney(p.price)}</span>
                                            <button className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors">
                                                <i className="fas fa-cart-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Khối Phân trang (Pagination) chuẩn xác theo giao diện */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-10">
                                    <nav className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                            disabled={currentPage === 0}
                                            className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(index)}
                                                className={`w-10 h-10 rounded font-medium transition-colors ${
                                                    currentPage === index 
                                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                            disabled={currentPage === totalPages - 1}
                                            className="w-10 h-10 border border-gray-300 rounded hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;