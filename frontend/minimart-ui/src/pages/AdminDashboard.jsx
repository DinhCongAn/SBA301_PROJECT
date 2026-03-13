import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../api/adminApi';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        successfulOrders: 0
    });
    const [loading, setLoading] = useState(true);

    // Xác thực Admin (Đảm bảo chỉ Admin mới vào được trang này)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // Giả sử cột role trong DB của bạn là 'ADMIN' hoặc role_id = 1
        if (!user || user.role !== 'ADMIN') { 
            alert("Bạn không có quyền truy cập trang này!");
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                setStats(res.data);
            } catch (error) {
                console.error("Lỗi tải thống kê", error);
            }
            setLoading(false);
        };
        fetchStats();
    }, [navigate]);

    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + 'đ';

    if (loading) return <div className="text-center py-32 text-emerald-500"><i className="fas fa-spinner fa-spin text-4xl"></i></div>;

    return (
        <div className="bg-gray-100 min-h-screen p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header của Admin */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Tổng quan (Dashboard)</h2>
                        <p className="text-gray-500 text-sm mt-1">Cập nhật tình hình kinh doanh của MiniMart</p>
                    </div>
                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-white text-gray-600 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 font-medium transition">
                        <i className="fas fa-external-link-alt mr-2"></i> Xem trang khách hàng
                    </button>
                </div>

                {/* 4 Thẻ Thống Kê (Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    {/* Card Doanh Thu */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center transform hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mr-4">
                            <i className="fas fa-wallet"></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</p>
                            <h3 className="text-2xl font-bold text-gray-900">{formatMoney(stats.totalRevenue)}</h3>
                        </div>
                    </div>

                    {/* Card Đơn Hàng */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center transform hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mr-4">
                            <i className="fas fa-shopping-bag"></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Tổng đơn hàng</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders} <span className="text-sm text-green-500 font-normal ml-2">(+{stats.successfulOrders} đã giao)</span></h3>
                        </div>
                    </div>

                    {/* Card Sản Phẩm */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center transform hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mr-4">
                            <i className="fas fa-box-open"></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Sản phẩm hiện có</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
                        </div>
                    </div>

                    {/* Card Khách Hàng */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center transform hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mr-4">
                            <i className="fas fa-users"></i>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Khách hàng</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                        </div>
                    </div>
                </div>

                {/* Khu vực Biểu đồ & Tóm tắt nhanh */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Biểu đồ giả lập bằng Tailwind (Không cần thư viện) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Doanh thu tuần này</h3>
                        <div className="flex items-end justify-between h-64 mt-4 space-x-2">
                            {/* Cột T2 */}
                            <div className="w-full flex flex-col items-center group">
                                <div className="w-full bg-emerald-100 rounded-t-md relative group-hover:bg-emerald-200 transition" style={{ height: '40%' }}>
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition">4Tr</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-3 font-medium">T2</span>
                            </div>
                            {/* Cột T3 */}
                            <div className="w-full flex flex-col items-center group">
                                <div className="w-full bg-emerald-500 rounded-t-md shadow-sm relative group-hover:bg-emerald-600 transition" style={{ height: '70%' }}>
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition">7Tr</span>
                                </div>
                                <span className="text-xs text-gray-800 mt-3 font-bold">T3</span>
                            </div>
                            {/* Cột T4 */}
                            <div className="w-full flex flex-col items-center group">
                                <div className="w-full bg-emerald-100 rounded-t-md relative group-hover:bg-emerald-200 transition" style={{ height: '30%' }}>
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition">3Tr</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-3 font-medium">T4</span>
                            </div>
                            {/* Cột T5 */}
                            <div className="w-full flex flex-col items-center group">
                                <div className="w-full bg-emerald-100 rounded-t-md relative group-hover:bg-emerald-200 transition" style={{ height: '80%' }}>
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition">8Tr</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-3 font-medium">T5</span>
                            </div>
                            {/* Cột T6 */}
                            <div className="w-full flex flex-col items-center group">
                                <div className="w-full bg-emerald-100 rounded-t-md relative group-hover:bg-emerald-200 transition" style={{ height: '50%' }}>
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition">5Tr</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-3 font-medium">T6</span>
                            </div>
                            {/* Cột T7 */}
                            <div className="w-full flex flex-col items-center group">
                                <div className="w-full bg-emerald-100 rounded-t-md relative group-hover:bg-emerald-200 transition" style={{ height: '90%' }}>
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition">9Tr</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-3 font-medium">T7</span>
                            </div>
                            {/* Cột CN */}
                            <div className="w-full flex flex-col items-center group">
                                <div className="w-full bg-emerald-100 rounded-t-md relative group-hover:bg-emerald-200 transition" style={{ height: '60%' }}>
                                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold bg-gray-800 text-white px-2 py-1 rounded transition">6Tr</span>
                                </div>
                                <span className="text-xs text-gray-500 mt-3 font-medium">CN</span>
                            </div>
                        </div>
                    </div>

                    {/* Hoạt động gần đây */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Trạng thái hệ thống</h3>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 mr-3"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Database SQL Server</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Đang chạy ổn định (Ping: 12ms)</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 mr-3"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Spring Boot API</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Hoạt động bình thường</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 mr-3"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Gemini AI Service</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Sẵn sàng phản hồi</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 mr-3"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Cảnh báo tồn kho</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Có 3 sản phẩm sắp hết hàng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;