import React, { useState, useEffect } from 'react';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../api/adminApi';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Phân trang & Lọc
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterPayment, setFilterPayment] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Modal Chi tiết
    const [selectedOrder, setSelectedOrder] = useState(null);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await fetchAdminOrders(page, 10, searchTerm, filterStatus, filterPayment, startDate, endDate);
            setOrders(res.data?.content || []);
            setTotalPages(res.data?.totalPages || 0);
            setTotalElements(res.data?.totalElements || 0);
        } catch (error) {
            console.error("Lỗi tải đơn hàng", error);
            setOrders([]);
        }
        setLoading(false);
    };

    useEffect(() => { loadOrders(); }, [page, filterStatus, filterPayment, startDate, endDate]);

    const handleClearFilters = () => {
        setSearchTerm(''); setFilterStatus('ALL'); setFilterPayment('ALL'); 
        setStartDate(''); setEndDate(''); setPage(0);
        loadOrders();
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if(window.confirm(`Bạn chắc chắn muốn chuyển trạng thái thành: ${newStatus}? Khách hàng sẽ nhận được Email thông báo ngay lập tức.`)) {
            try {
                await updateAdminOrderStatus(orderId, newStatus);
                alert("Cập nhật thành công và đã gửi Mail cho khách!");
                loadOrders();
                // 🚀 Fix lỗi undefined id: Đảm bảo kiểm tra cả id và orderId
                if(selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
                    setSelectedOrder({...selectedOrder, status: newStatus});
                }
            } catch (error) {
                alert("Lỗi cập nhật trạng thái!");
            }
        }
    };

    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + 'đ';
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('vi-VN');

    // 🚀 ĐÃ SỬA: Cập nhật màu sắc Badge cho đồng bộ 4 trạng thái mới
    const StatusBadge = ({ status }) => {
        const badges = {
            'PENDING': { color: 'bg-yellow-100 text-yellow-700', text: 'Chờ xác nhận', icon: 'fa-clock' },
            'DELIVERING': { color: 'bg-blue-100 text-blue-700', text: 'Đang giao', icon: 'fa-truck' },
            'DELIVERED': { color: 'bg-emerald-100 text-emerald-700', text: 'Đã hoàn thành', icon: 'fa-check-circle' },
            'CANCELLED': { color: 'bg-red-100 text-red-700', text: 'Đã hủy', icon: 'fa-times-circle' }
        };
        const b = badges[status] || badges['PENDING'];
        return <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center w-max ${b.color}`}><i className={`fas ${b.icon} mr-1.5`}></i> {b.text}</span>;
    };

    return (
        <div className="fade-in space-y-6 pb-10">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Đơn Hàng</h2>
                    <p className="text-gray-500 text-sm">Tổng cộng: <span className="font-bold text-emerald-600">{totalElements}</span> đơn hàng</p>
                </div>
            </div>

            {/* --- BỘ LỌC --- */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <i className="fas fa-search absolute left-4 top-3 text-gray-400"></i>
                        <input type="text" placeholder="Tìm Mã đơn, Tên KH..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadOrders()} />
                    </div>
                    <button onClick={() => { setPage(0); loadOrders(); }} className="px-6 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition">Lọc</button>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* 🚀 ĐÃ SỬA: Đồng bộ Dropdown Lọc */}
                    <select className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium" value={filterStatus} onChange={e => { setPage(0); setFilterStatus(e.target.value); }}>
                        <option value="ALL">Mọi trạng thái</option>
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="DELIVERING">Đang giao</option>
                        <option value="DELIVERED">Đã hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>

                    <select className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium" value={filterPayment} onChange={e => { setPage(0); setFilterPayment(e.target.value); }}>
                        <option value="ALL">Mọi thanh toán</option>
                        <option value="COD">Thanh toán tiền mặt (COD)</option>
                        <option value="VNPAY">Chuyển khoản VNPay</option>
                    </select>

                    <input type="date" className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium text-gray-600" value={startDate} onChange={e => { setPage(0); setStartDate(e.target.value); }} title="Từ ngày"/>
                    <input type="date" className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium text-gray-600" value={endDate} onChange={e => { setPage(0); setEndDate(e.target.value); }} title="Đến ngày"/>

                    <button onClick={handleClearFilters} className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition" title="Xóa bộ lọc"><i className="fas fa-redo"></i></button>
                </div>
            </div>

            {/* --- BẢNG ĐƠN HÀNG --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr><th className="px-6 py-4">Mã Đơn</th><th className="px-6 py-4">Khách hàng</th><th className="px-6 py-4">Ngày đặt</th><th className="px-6 py-4 text-right">Tổng tiền</th><th className="px-6 py-4">Trạng thái</th><th className="px-6 py-4 text-center">Thao tác</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan="6" className="text-center py-12"><i className="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i></td></tr> 
                            : orders.length === 0 ? <tr><td colSpan="6" className="text-center py-12 text-gray-500">Không tìm thấy đơn hàng nào phù hợp.</td></tr> 
                            : orders.map(order => (
                                // 🚀 Fix lỗi undefined id bằng cách lấy id || orderId
                                <tr key={order.id || order.orderId} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-800">#{order.orderCode}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-700">{order.user?.fullName || 'Khách vãng lai'}</p>
                                        <p className="text-xs text-gray-500">{order.user?.phone || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{formatDate(order.orderDate)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-red-500">{formatMoney(order.totalAmount)}</td>
                                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => setSelectedOrder(order)} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 hover:text-white transition shadow-sm">
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Phân trang */}
                {!loading && totalPages > 1 && (
                    <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">Trang <b className="text-gray-900">{page + 1}</b> / {totalPages}</span>
                        <div className="flex gap-2">
                            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg text-sm border disabled:opacity-50">Trước</button>
                            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg text-sm bg-emerald-500 text-white disabled:opacity-50">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODAL XEM CHI TIẾT & ĐỔI TRẠNG THÁI --- */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">Chi tiết Đơn hàng <span className="text-emerald-600">#{selectedOrder.orderCode}</span></h3>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(selectedOrder.orderDate)}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Cột trái: Thông tin khách & Trạng thái */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-700 border-b pb-2 mb-3 text-sm uppercase">Cập nhật Trạng thái</h4>
                                    
                                    {/* 🚀 ĐÃ SỬA: Đồng bộ Modal Đổi trạng thái */}
                                    <select 
                                        className="w-full p-2.5 border border-emerald-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm bg-white"
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusChange(selectedOrder.id || selectedOrder.orderId, e.target.value)}
                                        disabled={selectedOrder.status === 'DELIVERED' || selectedOrder.status === 'CANCELLED'} // Khóa nếu đã Hoàn thành/Hủy
                                    >
                                        <option value="PENDING">Chờ xác nhận</option>
                                        <option value="DELIVERING">Đang giao</option>
                                        <option value="DELIVERED">Đã hoàn thành</option>
                                        <option value="CANCELLED">Đã hủy</option>
                                    </select>
                                    
                                    {(selectedOrder.status === 'DELIVERED' || selectedOrder.status === 'CANCELLED') && <p className="text-[10px] text-red-500 italic mt-2">* Đơn hàng đã Đóng, không thể thay đổi trạng thái.</p>}
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <h4 className="font-bold text-gray-700 border-b pb-2 mb-3 text-sm uppercase"><i className="fas fa-user mr-2 text-blue-500"></i> Khách hàng</h4>
                                    <p className="text-sm font-bold text-gray-800">{selectedOrder.user?.fullName}</p>
                                    <p className="text-sm text-gray-600 mt-1"><i className="fas fa-phone w-5"></i> {selectedOrder.user?.phone}</p>
                                    <p className="text-sm text-gray-600 mt-1"><i className="fas fa-envelope w-5"></i> {selectedOrder.user?.email}</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <h4 className="font-bold text-gray-700 border-b pb-2 mb-3 text-sm uppercase"><i className="fas fa-map-marker-alt mr-2 text-red-500"></i> Giao hàng</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.shippingAddress}</p>
                                    <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                        <span className="text-xs font-bold text-gray-500 block mb-1">Phương thức thanh toán:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${selectedOrder.paymentMethod === 'VNPAY' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {selectedOrder.paymentMethod === 'VNPAY' ? 'Chuyển khoản VNPay' : 'Tiền mặt (COD)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải: Danh sách sản phẩm */}
                            <div className="md:col-span-2">
                                <h4 className="font-bold text-gray-700 border-b pb-2 mb-4 text-sm uppercase">Sản phẩm đã đặt</h4>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems?.map(item => (
                                        <div key={item.orderItemId || item.id} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition">
                                            <img src={item.product?.thumbnailUrl || 'https://placehold.co/80'} alt="sp" className="w-16 h-16 rounded-lg object-cover border" />
                                            <div className="flex-1">
                                                <h5 className="font-bold text-gray-800 text-sm line-clamp-1">{item.product?.name || 'Sản phẩm không xác định'}</h5>
                                                <p className="text-xs text-gray-500 mt-1">Đơn giá: {formatMoney(item.priceAtPurchase)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-600">x{item.quantity}</p>
                                                <p className="font-bold text-emerald-600">{formatMoney(item.priceAtPurchase * item.quantity)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-700 uppercase">Tổng thanh toán:</span>
                                    <span className="text-2xl font-extrabold text-red-500">{formatMoney(selectedOrder.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;