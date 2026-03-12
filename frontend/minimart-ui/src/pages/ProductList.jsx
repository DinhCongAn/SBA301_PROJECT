import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../api/productApi';

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('search'); // Lấy chữ trên URL

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Gọi API mỗi khi từ khóa tìm kiếm thay đổi
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchProducts(keyword);
            setProducts(data);
            setLoading(false);
        };
        loadData();
    }, [keyword]);

    const formatMoney = (amount) => amount.toLocaleString('vi-VN') + 'đ';

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {keyword ? `Kết quả tìm kiếm cho: "${keyword}"` : "Tất cả sản phẩm"}
            </h1>

            {loading ? (
                <div className="text-center py-20 text-emerald-500">
                    <i className="fas fa-spinner fa-spin text-4xl"></i>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <h2 className="text-xl text-gray-500">Không tìm thấy sản phẩm nào!</h2>
                    <Link to="/" className="mt-4 inline-block text-emerald-600 font-bold hover:underline">
                        Quay lại trang chủ
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((p) => (
                        <div key={p.productId} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col hover:shadow-lg transition-shadow">
                            <img src={p.thumbnailUrl} alt={p.name} className="h-40 object-contain w-full mb-3" />
                            <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{p.name}</h3>
                            <span className="text-emerald-600 font-bold mt-auto">{formatMoney(p.price)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;