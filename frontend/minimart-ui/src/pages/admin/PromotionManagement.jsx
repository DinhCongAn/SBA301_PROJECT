import React, { useState, useEffect } from 'react';
import { fetchAdminPromotions, saveAdminPromotion, toggleAdminPromotion, deleteAdminPromotion } from '../../api/adminApi';

const PromotionManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [filterActive, setFilterActive] = useState(''); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 🚀 Bổ sung usageLimit vào formData
    const [formData, setFormData] = useState({
        id: null, code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', usageLimit: '', isActive: true
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchAdminPromotions(page, 10, searchTerm, filterType, filterActive);
            setPromotions(res.data?.content || []);
            setTotalPages(res.data?.totalPages || 0);
            setTotalElements(res.data?.totalElements || 0);
        } catch (error) { console.error(error); setPromotions([]); }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [page, filterType, filterActive]);

    const handleClearFilters = () => {
        setSearchTerm(''); setFilterType('ALL'); setFilterActive(''); setPage(0);
        loadData();
    };

    const openAddModal = () => {
        setFormData({ id: null, code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', usageLimit: '', isActive: true });
        setIsModalOpen(true);
    };

    const openEditModal = (p) => {
        setFormData({
            id: p.id, code: p.code, discountType: p.discountType, discountValue: p.discountValue,
            minOrderAmount: p.minOrderAmount || '', usageLimit: p.usageLimit || '', isActive: p.isActive
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.discountValue <= 0) return alert("Mức giảm giá phải lớn hơn 0!");
        if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) return alert("Phần trăm giảm không được vượt quá 100%!");
        
        // Xử lý giá trị rỗng thành null trước khi gửi xuống Backend
        const dataToSubmit = {
            ...formData,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
        };

        try {
            await saveAdminPromotion(dataToSubmit);
            setIsModalOpen(false);
            loadData();
            alert("Lưu mã khuyến mãi thành công!");
        } catch (error) { alert(error.response?.data || "Lỗi hệ thống!"); }
    };

    const handleToggle = async (id) => {
        try {
            await toggleAdminPromotion(id);
            loadData();
        } catch (error) { alert("Lỗi khi thay đổi trạng thái!"); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Bạn chắc chắn muốn xóa vĩnh viễn mã này?")) {
            try {
                await deleteAdminPromotion(id); loadData();
            } catch (error) { alert("Không thể xóa mã đang được sử dụng!"); }
        }
    };

    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + 'đ';

    return (
        <div className="fade-in space-y-6 pb-10">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Mã Khuyến Mãi (Promos)</h2>
                    <p className="text-gray-500 text-sm">Hệ thống có <span className="font-bold text-emerald-600">{totalElements}</span> mã</p>
                </div>
                <button onClick={openAddModal} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm">
                    <i className="fas fa-plus mr-2"></i> Tạo Mã Mới
                </button>
            </div>

            {/* --- BỘ LỌC PHỨC TẠP --- */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <i className="fas fa-search absolute left-4 top-3 text-gray-400"></i>
                        <input type="text" placeholder="Tìm theo mã Code..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none text-sm uppercase" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadData()} />
                    </div>
                    <button onClick={() => { setPage(0); loadData(); }} className="px-6 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition">Lọc</button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <select className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium" value={filterType} onChange={e => { setPage(0); setFilterType(e.target.value); }}>
                        <option value="ALL">Mọi loại giảm giá</option>
                        <option value="PERCENTAGE">Giảm theo %</option>
                        <option value="FIXED">Giảm tiền mặt</option>
                    </select>
                    <select className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium" value={filterActive} onChange={e => { setPage(0); setFilterActive(e.target.value); }}>
                        <option value="">Mọi trạng thái</option>
                        <option value="true">Đang Bật</option>
                        <option value="false">Đang Tắt</option>
                    </select>
                    <button onClick={handleClearFilters} className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition" title="Xóa bộ lọc"><i className="fas fa-redo"></i></button>
                </div>
            </div>

            {/* --- BẢNG DỮ LIỆU --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Mã Code</th>
                            <th className="px-6 py-4">Mức Giảm</th>
                            <th className="px-6 py-4">Đơn tối thiểu</th>
                            <th className="px-6 py-4 text-center">Tiến độ (Đã dùng)</th>
                            <th className="px-6 py-4 text-center">Bật/Tắt</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan="6" className="text-center py-12"><i className="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i></td></tr> 
                        : promotions.length === 0 ? <tr><td colSpan="6" className="text-center py-12 text-gray-500">Không tìm thấy mã khuyến mãi nào phù hợp.</td></tr> 
                        : promotions.map(p => {
                            // Tính toán thanh tiến độ
                            const isUnlimited = p.usageLimit === null || p.usageLimit === 0;
                            const percent = isUnlimited ? 0 : Math.min(100, Math.round(((p.usedCount || 0) / p.usageLimit) * 100));
                            const isFull = !isUnlimited && (p.usedCount || 0) >= p.usageLimit;

                            return (
                                <tr key={p.id} className={`transition ${(!p.isActive || isFull) ? 'bg-gray-50/50 grayscale opacity-70' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4">
                                        <span className="font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 tracking-wider">{p.code}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">
                                        {p.discountType === 'PERCENTAGE' ? <span className="text-blue-600">Giảm {p.discountValue}%</span> : <span className="text-red-500">Giảm {formatMoney(p.discountValue)}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{p.minOrderAmount ? formatMoney(p.minOrderAmount) : 'Không yêu cầu'}</td>
                                    
                                    {/* 🚀 Cột hiển thị Số lượng & Tiến độ */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-gray-600 mb-1">
                                                {p.usedCount || 0} / {isUnlimited ? '∞' : p.usageLimit}
                                            </span>
                                            {!isUnlimited && (
                                                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className={`h-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleToggle(p.id)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openEditModal(p)} className="text-blue-600 bg-blue-50 p-2.5 rounded-lg mr-2 hover:bg-blue-500 hover:text-white transition"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 bg-red-50 p-2.5 rounded-lg hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {!loading && totalPages > 1 && (
                    <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">Trang <b className="text-gray-900">{page + 1}</b> / {totalPages}</span>
                        <div className="flex gap-2">
                            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">Trước</button>
                            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-sm disabled:opacity-50">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b flex justify-between bg-gray-50">
                            <h3 className="font-bold text-xl text-gray-800">{formData.id ? 'Sửa Mã Khuyến Mãi' : 'Tạo Mã Khuyến Mãi Mới'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Mã Code (Tự in hoa) *</label>
                                    <input required type="text" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-600 uppercase tracking-widest bg-gray-50" placeholder="VD: TET2026" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Loại giảm giá</label>
                                    <select className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value, discountValue: ''})}>
                                        <option value="PERCENTAGE">Giảm theo Phần trăm (%)</option>
                                        <option value="FIXED">Giảm Tiền mặt (VNĐ)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Mức giảm *</label>
                                    <div className="relative">
                                        <input required type="number" min="1" className="w-full border border-gray-300 rounded-xl p-3 pr-10 outline-none focus:ring-2 focus:ring-emerald-500" placeholder={formData.discountType === 'PERCENTAGE' ? "VD: 15" : "VD: 50000"} value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} />
                                        <span className="absolute right-4 top-3.5 font-bold text-gray-400">{formData.discountType === 'PERCENTAGE' ? '%' : 'đ'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Giá trị Đơn tối thiểu</label>
                                    <input type="number" min="0" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0 = Không yêu cầu" value={formData.minOrderAmount} onChange={e => setFormData({...formData, minOrderAmount: e.target.value})} />
                                </div>
                            </div>

                            {/* 🚀 Bổ sung ô nhập Giới hạn số lượng */}
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">Giới hạn lượt sử dụng</label>
                                <input type="number" min="1" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Bỏ trống nếu mã không giới hạn số lượng" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} />
                                <p className="text-[11px] text-gray-500 mt-1 italic">* Khách sẽ không thể nhập mã này nếu đã có đủ người sử dụng.</p>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Hủy bỏ</button>
                                <button type="submit" className="flex-1 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg flex items-center justify-center"><i className="fas fa-save mr-2 text-lg"></i> Lưu Mã Code</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionManagement;