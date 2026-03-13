import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItemApi, removeCartItem, getAiChefRecipe } from '../api/cartApi';

const Cart = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // AI States
    const [recipe, setRecipe] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const loadCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const res = await getCart(user.user_id);
            setCartItems(res.data);
        } catch (error) { console.error("Lỗi tải giỏ hàng", error); }
        setLoading(false);
    };

    useEffect(() => { loadCart(); }, []);

    // Xử lý đổi số lượng
    const handleUpdateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.product.stockQuantity) {
            return alert(`Sản phẩm này chỉ còn ${item.product.stockQuantity} mặt hàng!`);
        }

        // Tạm thời update giao diện cho mượt
        const updatedItems = cartItems.map(x => x.id === item.id ? { ...x, quantity: newQuantity } : x);
        setCartItems(updatedItems);

        try {
            // Sửa thành gọi updateCartItemApi
            await updateCartItemApi(user.user_id, item.product.productId, newQuantity);
        } catch (error) {
            alert("Lỗi cập nhật số lượng!");
            loadCart(); 
        }
    };

    // Xóa item
    const handleRemove = async (cartItemId) => {
        if(window.confirm("Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?")) {
            await removeCartItem(cartItemId);
            loadCart();
            setRecipe(''); // Reset AI nếu giỏ thay đổi
        }
    };

    // Tính toán tiền
    const subTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + 'đ';

    // GỌI ĐẦU BẾP AI
    const handleCallAiChef = async () => {
        if(cartItems.length === 0) return alert("Giỏ hàng trống, Đầu bếp không biết nấu gì đâu!");
        
        setIsAiLoading(true);
        setRecipe('');
        try {
            const productNames = cartItems.map(item => item.product.name);
            const res = await getAiChefRecipe(productNames);
            setRecipe(res.data.recipe);
        } catch (error) {
            setRecipe("Đầu bếp AI đang bận phục vụ bàn khác. Vui lòng thử lại sau nhé!");
        }
        setIsAiLoading(false);
    };

    if (loading) return <div className="text-center py-32 text-emerald-500"><i className="fas fa-spinner fa-spin text-4xl"></i></div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20 fade-in">
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h2>
                
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                        <i className="fas fa-shopping-basket text-6xl text-gray-200 mb-4"></i>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Giỏ hàng đang trống</h3>
                        <p className="text-gray-500 mb-6">Hãy lấp đầy giỏ hàng bằng những mặt hàng tươi ngon nhé!</p>
                        <Link to="/products" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 shadow-md">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* CỘT TRÁI: Bảng Sản Phẩm & AI Chef */}
                        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-max">
                            
                            {/* Bảng Giỏ hàng */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-bold">Sản phẩm</th>
                                            <th className="px-6 py-4 font-bold text-center">Đơn giá</th>
                                            <th className="px-6 py-4 font-bold text-center">Số lượng</th>
                                            <th className="px-6 py-4 font-bold text-right">Tổng tiền</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {cartItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-5 flex items-center space-x-4">
                                                    <img src={item.product.thumbnailUrl || "https://placehold.co/100x100"} alt="sp" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                                    <div>
                                                        <Link to={`/product/${item.product.productId}`} className="font-bold text-gray-800 hover:text-emerald-600 block mb-1">
                                                            {item.product.name}
                                                        </Link>
                                                        <span className="text-xs text-gray-500">Kho: {item.product.stockQuantity}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium text-gray-600">
                                                    {formatMoney(item.product.price)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden bg-white w-max mx-auto h-9">
                                                        <button onClick={() => handleUpdateQuantity(item, item.quantity - 1)} className="px-3 text-gray-500 hover:bg-gray-100 h-full font-bold">-</button>
                                                        <input type="text" readOnly value={item.quantity} className="w-10 text-center border-x border-gray-300 h-full focus:outline-none font-bold text-sm" />
                                                        <button onClick={() => handleUpdateQuantity(item, item.quantity + 1)} className="px-3 text-gray-500 hover:bg-gray-100 h-full font-bold">+</button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-emerald-600">
                                                    {formatMoney(item.product.price * item.quantity)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button onClick={() => handleRemove(item.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* TÍNH NĂNG AI: ĐẦU BẾP GỢI Ý */}
                            <div className="m-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
                                <div className="flex flex-col sm:flex-row items-center justify-between">
                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm mr-4 border border-emerald-100">🧑‍🍳</div>
                                        <div>
                                            <h4 className="font-bold text-emerald-900 text-lg">Trợ lý Đầu bếp AI ✨</h4>
                                            <p className="text-sm text-emerald-700">Chưa biết nấu món gì với các nguyên liệu trong giỏ?</p>
                                        </div>
                                    </div>
                                    <button onClick={handleCallAiChef} disabled={isAiLoading} className="bg-white border-2 border-emerald-400 text-emerald-600 px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm whitespace-nowrap disabled:opacity-50 flex items-center">
                                        {isAiLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-magic mr-2"></i>}
                                        {isAiLoading ? 'Đang suy nghĩ...' : 'Gợi ý món ngon'}
                                    </button>
                                </div>
                                
                                {/* Kết quả trả về của AI */}
                                {recipe && (
                                    <div className="mt-5 pt-5 border-t border-emerald-200/60 fade-in">
                                        <div className="bg-white p-5 rounded-lg border border-emerald-100 shadow-inner">
                                            <div className="whitespace-pre-wrap font-medium text-gray-700 leading-relaxed text-sm">
                                                {recipe}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CỘT PHẢI: Khung Thanh Toán */}
                        <div className="w-full lg:w-96">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Tóm tắt đơn hàng</h3>
                                
                                <div className="flex justify-between mb-4 text-gray-600">
                                    <span>Tạm tính ({cartItems.length} SP)</span>
                                    <span className="font-medium text-gray-800">{formatMoney(subTotal)}</span>
                                </div>
                                <div className="flex justify-between mb-6 text-gray-600">
                                    <span>Phí giao hàng</span>
                                    <span className="text-emerald-500 font-medium">Miễn phí</span>
                                </div>
                                
                                <div className="border-t border-gray-200 border-dashed my-4"></div>
                                
                                <div className="flex justify-between mb-8 items-end">
                                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                                    <span className="text-3xl font-extrabold text-emerald-600">{formatMoney(subTotal)}</span>
                                </div>
                                
                                <button onClick={() => navigate('/checkout')} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition shadow-lg text-center block transform hover:-translate-y-0.5">
                                    Tiến hành thanh toán
                                </button>
                                
                                <div className="mt-6 flex items-center justify-center space-x-4 text-gray-400 text-xl">
                                    <i className="fab fa-cc-visa hover:text-blue-600 transition"></i>
                                    <i className="fab fa-cc-mastercard hover:text-blue-500 transition"></i>
                                    <i className="fab fa-cc-paypal hover:text-orange-500 transition"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;