import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient'; 

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // ✅ Gọi API qua axiosClient (Tự động đính kèm Token)
                const res = await axiosClient.get('/admin/dashboard/stats');
                setData(res.data);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu Dashboard", error);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    // Hàm format tiền (VD: 125.400.000 -> 125.4M, hoặc 45.000đ)
    const formatMoney = (amount) => {
        if (!amount) return '0đ';
        if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
        return amount.toLocaleString('vi-VN') + 'đ';
    };

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-full min-h-[60vh]">
                <i className="fas fa-spinner fa-spin text-4xl text-emerald-500"></i>
            </div>
        );
    }

    // Bóc tách dữ liệu JSON từ Backend trả về
    const { stats, weeklyRevenue, recentOrders, topProducts } = data;

    // Render Badge Trạng thái
    const renderStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 font-bold rounded text-xs">Pending</span>;
            case 'DELIVERED':
                return <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded text-xs">Delivered</span>;
            case 'SHIPPING':
            case 'DELIVERING':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded text-xs">Shipping</span>;
            case 'CANCELLED':
                return <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded text-xs">Cancelled</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded text-xs">{status}</span>;
        }
    };

    // LOGIC VẼ BIỂU ĐỒ 7 NGÀY
    // 1. Tìm doanh thu cao nhất để tính phần trăm chiều cao cho các cột
    const maxRevenue = Math.max(...(weeklyRevenue || [0]), 1); 
    
    // 2. Tạo mảng chứa Label 7 ngày gần nhất (VD: 09/03, 10/03...)
    const last7DaysLabels = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i)); // Lùi về 6 ngày trước -> hôm nay
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });

    return (
        <div className="fade-in space-y-6 pb-10">
            
            {/* ========================================= */}
            {/* 1. KHU VỰC 4 THẺ THỐNG KÊ                 */}
            {/* ========================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-2">Tổng người dùng</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{stats?.totalUsers?.toLocaleString() || 0}</h3>
                    <p className={`text-sm font-medium ${stats?.userTrendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        <i className={`fas ${stats?.userTrendUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> 
                        {stats?.userTrend || '0%'} <span className="text-gray-400 font-normal ml-1">tháng này</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-2">Tổng sản phẩm</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{stats?.totalProducts?.toLocaleString() || 0}</h3>
                    <p className={`text-sm font-medium ${stats?.productTrendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        <i className={`fas ${stats?.productTrendUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> 
                        {stats?.productTrend || '0%'} <span className="text-gray-400 font-normal ml-1">sản phẩm mới</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-2">Tổng đơn hàng</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{stats?.totalOrders?.toLocaleString() || 0}</h3>
                    <p className={`text-sm font-medium ${stats?.orderTrendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        <i className={`fas ${stats?.orderTrendUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> 
                        {stats?.orderTrend || '0%'} <span className="text-gray-400 font-normal ml-1">tháng này</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-2">Doanh thu thực tế (Đã giao)</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{formatMoney(stats?.totalRevenue)}</h3>
                    <p className={`text-sm font-medium ${stats?.revenueTrendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        <i className={`fas ${stats?.revenueTrendUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> 
                        {stats?.revenueTrend || '0%'} <span className="text-gray-400 font-normal ml-1">tháng này</span>
                    </p>
                </div>

            </div>

            {/* ========================================= */}
            {/* 2. BIỂU ĐỒ & BẢNG DANH SÁCH               */}
            {/* ========================================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* CỘT TRÁI (Biểu đồ + Đơn hàng mới) - Chiếm 2/3 không gian */}
                <div className="xl:col-span-2 space-y-6">
                    
                    {/* KHU VỰC BIỂU ĐỒ DOANH THU 7 NGÀY */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Biểu đồ Doanh thu (7 Ngày qua)</h3>
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">Đã giao thành công</span>
                        </div>
                        
                        {/* 1. Vùng chứa Cột biểu đồ (Đã chốt chiều cao h-48) */}
                        <div className="flex items-end justify-between h-48 space-x-2 border-b border-gray-100 pb-1">
                            {weeklyRevenue?.map((amount, index) => {
                                // Tính chiều cao (Tối thiểu 3% để hiện vạch xám cho ngày 0đ)
                                const heightPercent = Math.max((amount / maxRevenue) * 100, 3); 
                                
                                return (
                                    <div key={index} className="w-full h-full flex flex-col justify-end group relative">
                                        <div 
                                            className={`w-full rounded-t-md transition-all duration-500 cursor-pointer ${amount > 0 ? 'bg-emerald-300 group-hover:bg-emerald-500' : 'bg-gray-100'}`}
                                            style={{ height: `${heightPercent}%` }}
                                        >
                                            {/* Tooltip hiện số tiền khi rê chuột */}
                                            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition whitespace-nowrap z-10 pointer-events-none shadow-lg">
                                                {formatMoney(amount)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* 2. Vùng chứa Nhãn (Ngày/Tháng) tách biệt ở dưới */}
                        <div className="flex justify-between items-center mt-3 space-x-2">
                            {last7DaysLabels.map((label, index) => (
                                <div key={index} className={`w-full text-center text-xs ${index === 6 ? 'text-emerald-600 font-bold' : 'text-gray-500 font-medium'}`}>
                                    {index === 6 ? 'Hôm nay' : label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BẢNG ĐƠN HÀNG MỚI NHẤT */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Đơn hàng mới nhất</h3>
                            <Link to="/admin/orders" className="text-sm text-emerald-500 font-medium hover:underline">Xem tất cả</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500 font-medium bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-gray-100">Mã ĐH</th>
                                        <th className="px-6 py-4 border-b border-gray-100">Khách hàng</th>
                                        <th className="px-6 py-4 border-b border-gray-100">Tổng tiền</th>
                                        <th className="px-6 py-4 border-b border-gray-100 text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {!recentOrders || recentOrders.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center py-6 text-gray-400">Chưa có đơn hàng nào</td></tr>
                                    ) : (
                                        recentOrders.map((order, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-800 font-bold">#{order.orderCode}</td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">{order.customer}</td>
                                                <td className="px-6 py-4 text-gray-800 font-bold">{order.total?.toLocaleString()}đ</td>
                                                <td className="px-6 py-4 text-center">
                                                    {renderStatusBadge(order.status)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI (Sản phẩm bán chạy) - Chiếm 1/3 không gian */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-max">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800">Sản phẩm bán chạy nhất</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {!topProducts || topProducts.length === 0 ? (
                            <p className="text-center text-gray-400">Chưa có dữ liệu bán hàng</p>
                        ) : (
                            topProducts.map((product, index) => (
                                <div key={index} className="flex items-center group">
                                    <img 
                                        src={product.image || 'https://placehold.co/100'} 
                                        alt={product.name} 
                                        className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-100 object-cover mr-4 group-hover:scale-105 transition"
                                    />
                                    <div className="flex-1">
                                        <Link to={`/admin/products`} className="text-sm font-bold text-gray-800 hover:text-emerald-600 line-clamp-2">
                                            {product.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">Đã bán: <span className="text-emerald-600">{product.sold}</span></p>
                                    </div>
                                    <div className="text-gray-800 font-bold text-sm ml-2">
                                        {formatMoney(product.price)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;