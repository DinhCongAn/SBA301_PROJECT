import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrders, getOrderItems, cancelOrderApi } from '../api/orderApi';

const Orders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    
    // State quản lý xem chi tiết đơn hàng
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(false);

    useEffect(() => {
        if (!user) return navigate('/login');
        
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await getUserOrders(user.user_id);
                setOrders(res.data);
            } catch (error) { console.error("Lỗi tải đơn hàng", error); }
            setLoading(false);
        };
        fetchOrders();
    }, [navigate]);

    // Format tiền và ngày tháng
    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + 'đ';
    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    // Helper: Trạng thái và màu sắc
    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING': return { text: 'Chờ xác nhận', color: 'text-orange-600', bg: 'bg-orange-100', icon: 'fa-clock', progress: '25%' };
            case 'PROCESSING': return { text: 'Đang chuẩn bị', color: 'text-blue-600', bg: 'bg-blue-100', icon: 'fa-box', progress: '50%' };
            case 'DELIVERING': return { text: 'Đang giao hàng', color: 'text-purple-600', bg: 'bg-purple-100', icon: 'fa-truck', progress: '75%' };
            case 'DELIVERED': return { text: 'Đã giao thành công', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: 'fa-check-circle', progress: '100%' };
            case 'CANCELLED': return { text: 'Đã bị hủy', color: 'text-red-600', bg: 'bg-red-100', icon: 'fa-times-circle', progress: '100%' };
            default: return { text: status, color: 'text-gray-600', bg: 'bg-gray-100', icon: 'fa-info-circle', progress: '0%' };
        }
    };

    // Lọc đơn hàng theo tab
    const filteredOrders = activeTab === 'ALL' ? orders : orders.filter(o => {
        if (activeTab === 'PENDING') return o.status === 'PENDING';
        if (activeTab === 'DELIVERING') return o.status === 'PROCESSING' || o.status === 'DELIVERING';
        if (activeTab === 'DELIVERED') return o.status === 'DELIVERED';
        if (activeTab === 'CANCELLED') return o.status === 'CANCELLED';
        return true;
    });

    // Hàm mở chi tiết đơn hàng
    const handleViewDetail = async (order) => {
        setSelectedOrder(order);
        setItemsLoading(true);
        window.scrollTo(0, 0);
        try {
            const res = await getOrderItems(order.id);
            setOrderItems(res.data);
        } catch (error) { console.error("Lỗi lấy chi tiết đơn", error); }
        setItemsLoading(false);
    };

    // HÀM XỬ LÝ HỦY ĐƠN HÀNG
    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Quá trình này không thể hoàn tác.")) {
            try {
                await cancelOrderApi(orderId, user.user_id);
                alert("Đã hủy đơn hàng thành công!");
                const res = await getUserOrders(user.user_id);
                setOrders(res.data);
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({...selectedOrder, status: 'CANCELLED'});
                }
            } catch (error) {
                alert(error.response?.data || "Lỗi khi hủy đơn hàng");
            }
        }
    };

    if (loading) return <div className="text-center py-32 text-emerald-500"><i className="fas fa-spinner fa-spin text-4xl"></i></div>;

    // ==========================================
    // MÀN HÌNH 2: CHI TIẾT ĐƠN HÀNG (Detail)
    // ==========================================
    if (selectedOrder) {
        const sInfo = getStatusInfo(selectedOrder.status);
        return (
            <div className="bg-gray-50 min-h-screen pb-20 fade-in">
                <div className="max-w-4xl mx-auto px-4 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{selectedOrder.orderCode}</h2>
                        <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-emerald-600 font-medium">
                            <i className="fas fa-arrow-left mr-1"></i> Quay lại
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
                        {/* Thanh Tiến Trình (Progress Bar) */}
                        <div className="relative pt-4">
                            <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-gray-100">
                                <div style={{ width: sInfo.progress }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${selectedOrder.status === 'CANCELLED' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                <span className={selectedOrder.status !== 'CANCELLED' ? 'text-emerald-600' : ''}>Đặt hàng<br/>{formatDate(selectedOrder.orderDate)}</span>
                                <span className={['PROCESSING', 'DELIVERING', 'DELIVERED'].includes(selectedOrder.status) ? 'text-emerald-600 text-center' : 'text-center'}>Chuẩn bị</span>
                                <span className={['DELIVERING', 'DELIVERED'].includes(selectedOrder.status) ? 'text-emerald-600 text-center' : 'text-center'}>Đang giao</span>
                                <span className={selectedOrder.status === 'DELIVERED' ? 'text-emerald-600 text-right' : 'text-right'}>{selectedOrder.status === 'CANCELLED' ? 'Đã hủy' : 'Đã nhận'}</span>
                            </div>
                        </div>

                        {/* Thông tin Địa chỉ & Thanh toán */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-gray-100 py-6">
                            <div>
                                <h4 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider">Thông tin giao hàng</h4>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{selectedOrder.shippingAddress.replace(/ - /g, '\n')}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider">Hình thức thanh toán</h4>
                                <p className="text-gray-600 text-sm">{selectedOrder.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : selectedOrder.paymentMethod}</p>
                                <p className={`text-sm font-bold mt-1 ${selectedOrder.status === 'DELIVERED' ? 'text-emerald-600' : 'text-orange-500'}`}>
                                    Trạng thái: {selectedOrder.status === 'DELIVERED' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </p>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm chi tiết */}
                        <div>
                            {itemsLoading ? (
                                <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-emerald-500 text-xl"></i></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                            <tr><th className="py-3 px-4 rounded-tl-lg">Sản phẩm</th><th className="py-3 px-4 text-center">SL</th><th className="py-3 px-4 text-right rounded-tr-lg">Đơn giá</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orderItems.map(item => (
                                                <tr key={item.id}>
                                                    <td className="py-4 px-4 flex items-center">
                                                        <img src={item.product.thumbnailUrl || "https://placehold.co/100"} className="w-12 h-12 rounded border object-cover mr-3" alt="sp" />
                                                        <Link to={`/product/${item.product.productId}`} className="font-bold text-gray-800 hover:text-emerald-600">{item.product.name}</Link>
                                                    </td>
                                                    <td className="py-4 px-4 text-center font-medium">{item.quantity}</td>
                                                    <td className="py-4 px-4 text-right">{formatMoney(item.priceAtPurchase)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="border-t border-gray-100 pt-5 mt-4 flex justify-between items-center">
                                <div>
                                    {selectedOrder.status === 'PENDING' && (
                                        <button onClick={() => handleCancelOrder(selectedOrder.id)} className="px-5 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 border border-red-200 transition">
                                            <i className="fas fa-times mr-1"></i> Hủy đơn hàng này
                                        </button>
                                    )}
                                </div>
                                <p className="text-lg font-bold text-gray-900">Tổng thanh toán: <span className="text-emerald-600 ml-4 text-2xl">{formatMoney(selectedOrder.totalAmount)}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // MÀN HÌNH 1: LỊCH SỬ ĐƠN HÀNG (List)
    // ==========================================
    return (
        <div className="bg-gray-50 min-h-screen pb-20 fade-in">
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h2>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto hide-scrollbar">
                        {[
                            { id: 'ALL', label: 'Tất cả' },
                            { id: 'PENDING', label: 'Chờ xác nhận' },
                            { id: 'DELIVERING', label: 'Đang giao' },
                            { id: 'DELIVERED', label: 'Đã hoàn thành' },
                            { id: 'CANCELLED', label: 'Đã hủy' }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-emerald-600 border-b-2 border-emerald-600 bg-white' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Danh sách Order */}
                    <div className="p-6 md:p-8 space-y-6">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 font-medium">Bạn chưa có đơn hàng nào ở trạng thái này.</div>
                        ) : (
                            filteredOrders.map(order => {
                                const sInfo = getStatusInfo(order.status);
                                return (
                                    <div key={order.id} className="border border-gray-200 rounded-xl p-5 md:p-6 hover:shadow-md transition bg-white">
                                        
                                        {/* Header của Đơn Hàng */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-100 pb-4 gap-3">
                                            <div>
                                                <span className="font-bold text-gray-800 text-lg">Mã đơn: #{order.orderCode}</span>
                                                <span className="text-gray-500 text-sm ml-0 sm:ml-4 block sm:inline mt-1 sm:mt-0"><i className="far fa-clock"></i> {formatDate(order.orderDate)}</span>
                                            </div>
                                            <span className={`px-4 py-1.5 ${sInfo.bg} ${sInfo.color} rounded-full text-sm font-bold flex items-center w-max`}>
                                                <i className={`fas ${sInfo.icon} mr-1.5`}></i> {sInfo.text}
                                            </span>
                                        </div>

                                        {/* TÍNH NĂNG MỚI: DANH SÁCH SẢN PHẨM Ở BÊN NGOÀI */}
                                        {order.orderItems && order.orderItems.length > 0 && (
                                            <div className="my-4 space-y-4">
                                                {order.orderItems.map(item => (
                                                    <div key={item.id} className="flex items-center justify-between">
                                                        <div className="flex items-center flex-1">
                                                            <img src={item.product.thumbnailUrl || "https://placehold.co/100"} className="w-16 h-16 rounded-lg border border-gray-200 object-cover mr-4 shadow-sm" alt="sp" />
                                                            <div>
                                                                <Link to={`/product/${item.product.productId}`} className="font-bold text-gray-800 hover:text-emerald-600 line-clamp-1">
                                                                    {item.product.name}
                                                                </Link>
                                                                <p className="text-gray-500 text-sm mt-1 font-medium">x{item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <span className="font-medium text-gray-800">{formatMoney(item.priceAtPurchase)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Footer của Đơn Hàng (Tổng tiền & Nút) */}
                                        <div className="flex flex-col lg:flex-row justify-between items-end pt-4 border-t border-gray-100 border-dashed gap-4">
                                            <div className="text-sm text-gray-600 w-full lg:w-auto">
                                                <p className="mb-1"><span className="font-medium">Thanh toán:</span> {order.paymentMethod === 'COD' ? 'Khi nhận hàng' : order.paymentMethod}</p>
                                                <p><span className="font-medium">Tổng thanh toán:</span> <span className="text-xl font-extrabold text-emerald-600 ml-2">{formatMoney(order.totalAmount)}</span></p>
                                            </div>
                                            <div className="flex space-x-3 w-full lg:w-auto justify-end">
                                                {order.status === 'PENDING' && (
                                                    <button onClick={() => handleCancelOrder(order.id)} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 border border-red-200 transition">
                                                        Hủy đơn
                                                    </button>
                                                )}
                                                
                                                {order.status === 'DELIVERED' && (
                                                    <Link to="/products" className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-100 hidden sm:block border border-emerald-200">
                                                        Mua lại / Đánh giá
                                                    </Link>
                                                )}
                                                
                                                <button onClick={() => handleViewDetail(order)} className="px-5 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 shadow-sm transition">
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;