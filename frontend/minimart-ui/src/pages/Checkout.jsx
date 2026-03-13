import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../api/cartApi';
import { getAddresses } from '../api/addressApi';
import { applyPromoCode, placeOrderApi } from '../api/orderApi';

const Checkout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    
    // Form States
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    
    // Promo States
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        if (!user) return navigate('/login');

        const loadCheckoutData = async () => {
            setLoading(true);
            try {
                // Tải giỏ hàng
                const cartRes = await getCart(user.user_id);
                if (cartRes.data.length === 0) {
                    alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
                    return navigate('/cart');
                }
                setCartItems(cartRes.data);

                // Tải sổ địa chỉ
                const addrRes = await getAddresses(user.user_id);
                setAddresses(addrRes.data);
                // Tự động chọn địa chỉ mặc định nếu có
                const defaultAddr = addrRes.data.find(a => a.isDefault);
                if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                else if (addrRes.data.length > 0) setSelectedAddressId(addrRes.data[0].id);

            } catch (error) {
                console.error("Lỗi tải dữ liệu checkout", error);
            }
            setLoading(false);
        };

        loadCheckoutData();
    }, [navigate]);

    // TÍNH TOÁN TIỀN
    const subTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shippingFee = 0; // Miễn phí giao hàng
    const finalTotal = subTotal + shippingFee - discount;
    
    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + 'đ';

    // ÁP DỤNG MÃ GIẢM GIÁ
    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        try {
            const res = await applyPromoCode(promoCode, subTotal);
            setDiscount(res.data.discount);
            setPromoMessage({ text: res.data.message, type: 'success' });
        } catch (error) {
            setDiscount(0);
            setPromoMessage({ text: error.response?.data || "Mã không hợp lệ", type: 'error' });
        }
    };

    // ĐẶT HÀNG
    const handlePlaceOrder = async () => {
        if (!selectedAddressId) return alert("Vui lòng chọn địa chỉ giao hàng!");
        
        setIsPlacingOrder(true);
        
        // Trích xuất chuỗi địa chỉ từ ID được chọn để gửi xuống Backend snapshot
        const selectedAddr = addresses.find(a => a.id === parseInt(selectedAddressId));
        const addressSnapshot = `${selectedAddr.receiverName} - ${selectedAddr.phone} - ${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.province}`;

        const payload = {
            userId: user.user_id,
            addressSnapshot: addressSnapshot,
            paymentMethod: paymentMethod,
            finalTotal: finalTotal
        };

        try {
            const res = await placeOrderApi(payload);
            window.dispatchEvent(new Event('cartUpdated'));
            alert(res.data.message);
            // Thành công -> Đá về trang lịch sử đơn hàng hoặc trang chủ
            navigate('/'); 
        } catch (error) {
            alert(error.response?.data || "Đã xảy ra lỗi khi đặt hàng!");
            setIsPlacingOrder(false);
        }
    };

    if (loading) return <div className="text-center py-32 text-emerald-500"><i className="fas fa-spinner fa-spin text-4xl"></i></div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20 fade-in font-sans">
            
            <div className="bg-white border-b border-gray-200 py-4 mb-8">
                <div className="max-w-7xl mx-auto px-4 flex items-center text-lg">
                    <Link to="/cart" className="text-emerald-600 hover:text-emerald-700 mr-4"><i className="fas fa-arrow-left"></i> Quay lại giỏ hàng</Link>
                    <span className="font-bold text-gray-800 border-l border-gray-300 pl-4">Thanh toán an toàn</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
                
                {/* CỘT TRÁI: ĐỊA CHỈ & THANH TOÁN */}
                <div className="flex-1 space-y-6">
                    
                    {/* Khối 1: Địa chỉ giao hàng */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><i className="fas fa-map-marker-alt text-emerald-500 mr-2"></i> Địa chỉ giao hàng</h3>
                        
                        {addresses.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800 flex justify-between items-center">
                                <span>Bạn chưa có địa chỉ giao hàng nào.</span>
                                <Link to="/address" className="bg-yellow-100 px-4 py-2 rounded-lg font-bold hover:bg-yellow-200 transition">Thêm địa chỉ</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map(addr => (
                                    <label key={addr.id} className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition ${selectedAddressId === addr.id ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-200 hover:border-emerald-200'}`}>
                                        <input 
                                            type="radio" 
                                            name="address" 
                                            value={addr.id} 
                                            checked={selectedAddressId === addr.id}
                                            onChange={(e) => setSelectedAddressId(parseInt(e.target.value))}
                                            className="mt-1 mr-3 w-4 h-4 text-emerald-600 focus:ring-emerald-500" 
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800 flex items-center">
                                                {addr.receiverName} <span className="mx-2 text-gray-300">|</span> {addr.phone}
                                                {addr.isDefault && <span className="ml-3 text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm">Mặc định</span>}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">{addr.street}, {addr.city}, {addr.province}</div>
                                        </div>
                                    </label>
                                ))}
                                <Link to="/address" className="text-emerald-600 text-sm font-medium hover:underline inline-block mt-2">+ Thêm/Sửa địa chỉ khác</Link>
                            </div>
                        )}
                    </div>

                    {/* Khối 2: Phương thức thanh toán */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><i className="fas fa-wallet text-emerald-500 mr-2"></i> Phương thức thanh toán</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            <label className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition text-center ${paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-emerald-200'}`}>
                                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                <i className="fas fa-money-bill-wave text-3xl mb-2"></i>
                                <span className="font-bold text-sm">Thanh toán khi nhận hàng (COD)</span>
                            </label>

                            <label className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition text-center ${paymentMethod === 'VNPAY' ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-emerald-200'}`}>
                                <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-update.png" alt="VNPay" className="h-8 mb-2 object-contain grayscale opacity-60" />
                                <span className="font-bold text-sm">Ví VNPay</span>
                                <span className="text-[10px] text-red-500 font-medium">(Sắp ra mắt)</span>
                            </label>

                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                <div className="w-full lg:w-96 space-y-6">
                    
                    {/* Danh sách SP thu gọn */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Đơn hàng ({cartItems.length} sản phẩm)</h3>
                        <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex space-x-3">
                                    <img src={item.product.thumbnailUrl || "https://placehold.co/50x50"} className="w-12 h-12 rounded border object-cover" alt="" />
                                    <div className="flex-1 text-sm">
                                        <p className="font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                                        <div className="flex justify-between mt-1 text-gray-500">
                                            <span>SL: {item.quantity}</span>
                                            <span className="font-bold text-emerald-600">{formatMoney(item.product.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Khung Khuyến mãi & Chốt đơn */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        
                        {/* Mã giảm giá */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mã khuyến mãi</label>
                            <div className="flex space-x-2">
                                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Nhập mã..." />
                                <button onClick={handleApplyPromo} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-900 transition">Áp dụng</button>
                            </div>
                            {promoMessage.text && (
                                <p className={`text-xs mt-2 font-medium ${promoMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {promoMessage.type === 'success' ? <i className="fas fa-check-circle"></i> : <i className="fas fa-exclamation-circle"></i>} {promoMessage.text}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 border-t border-dashed border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between"><span>Tạm tính</span><span>{formatMoney(subTotal)}</span></div>
                            <div className="flex justify-between"><span>Phí vận chuyển</span><span>Miễn phí</span></div>
                            {discount > 0 && <div className="flex justify-between text-emerald-600 font-medium"><span>Khuyến mãi</span><span>- {formatMoney(discount)}</span></div>}
                        </div>
                        
                        <div className="flex justify-between items-end border-t border-gray-200 pt-4 mb-6">
                            <span className="font-bold text-gray-900 text-lg">Tổng thanh toán</span>
                            <span className="text-3xl font-extrabold text-emerald-600">{formatMoney(finalTotal)}</span>
                        </div>
                        
                        <button 
                            onClick={handlePlaceOrder} 
                            disabled={isPlacingOrder || addresses.length === 0}
                            className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition shadow-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPlacingOrder ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                            {isPlacingOrder ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;