import React, { useState, useEffect } from 'react';
import { fetchAdminSliders, saveAdminSlider, deleteAdminSlider } from '../../api/adminApi';

const SliderManagement = () => {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 🚀 State cho Bộ Lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null, title: '', imageUrl: '', linkUrl: '', orderNumber: 0, status: 'active'
    });

    const loadSliders = async () => {
        setLoading(true);
        try {
            const res = await fetchAdminSliders(searchTerm, filterStatus);
            setSliders(res.data || []);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    // Tải lại dữ liệu khi đổi bộ lọc
    useEffect(() => { loadSliders(); }, [filterStatus]);

    const openAddModal = () => {
        setFormData({ id: null, title: '', imageUrl: '', linkUrl: '', orderNumber: sliders.length + 1, status: 'active' });
        setIsModalOpen(true);
    };

    const openEditModal = (slider) => {
        setFormData({ ...slider });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl) return alert("Vui lòng nhập link ảnh Banner!");
        
        try {
            await saveAdminSlider(formData);
            setIsModalOpen(false);
            loadSliders();
            alert("Lưu Banner thành công!");
        } catch (error) { alert("Lỗi hệ thống khi lưu Banner!"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa Banner này khỏi Trang chủ?")) {
            try {
                await deleteAdminSlider(id);
                loadSliders();
            } catch (error) { alert("Không thể xóa Banner này!"); }
        }
    };

    const toggleStatus = async (slider) => {
        const updatedSlider = { ...slider, status: slider.status === 'active' ? 'inactive' : 'active' };
        try {
            await saveAdminSlider(updatedSlider);
            loadSliders();
        } catch (error) { alert("Lỗi cập nhật trạng thái!"); }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterStatus('ALL');
        loadSliders();
    };

    return (
        <div className="fade-in space-y-6 pb-10">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Banner (Slider)</h2>
                    <p className="text-gray-500 text-sm">Hệ thống đang có <span className="font-bold text-emerald-600">{sliders.length}</span> banner</p>
                </div>
                <button onClick={openAddModal} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm">
                    <i className="fas fa-plus mr-2"></i> Thêm Banner Mới
                </button>
            </div>

            {/* --- BỘ LỌC PHỨC TẠP --- */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <i className="fas fa-search absolute left-4 top-3 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo tiêu đề Banner..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none text-sm" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && loadSliders()} 
                        />
                    </div>
                    <button onClick={loadSliders} className="px-6 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition">Lọc</button>
                </div>

                <div className="flex flex-wrap gap-3">
                    <select className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="ALL">Mọi trạng thái</option>
                        <option value="active">Đang hiển thị</option>
                        <option value="inactive">Đã ẩn</option>
                    </select>
                    <button onClick={handleClearFilters} className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition" title="Xóa bộ lọc"><i className="fas fa-redo"></i></button>
                </div>
            </div>

            {/* --- BẢNG DỮ LIỆU --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 w-20 text-center">Vị trí</th>
                                <th className="px-6 py-4">Hình ảnh hiển thị</th>
                                <th className="px-6 py-4">Thông tin</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan="5" className="text-center py-12"><i className="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i></td></tr> 
                            : sliders.length === 0 ? <tr><td colSpan="5" className="text-center py-12 text-gray-500">Chưa có Banner nào phù hợp với bộ lọc.</td></tr> 
                            : sliders.map(s => (
                                <tr key={s.id} className={`transition ${s.status === 'inactive' ? 'bg-gray-50/50 grayscale opacity-70' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 text-center">
                                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold text-gray-700 border border-gray-300">
                                            {s.orderNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-64 h-24 rounded-xl overflow-hidden shadow-sm border">
                                            <img src={s.imageUrl} alt="Banner" className="w-full h-full object-cover" onError={(e) => e.target.src='https://placehold.co/600x200?text=Lỗi+Ảnh'} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800 text-base">{s.title || 'Không có tiêu đề'}</p>
                                        <a href={s.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center mt-1">
                                            <i className="fas fa-link mr-1"></i> {s.linkUrl || 'Không gắn link'}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => toggleStatus(s)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${s.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${s.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openEditModal(s)} className="text-blue-600 bg-blue-50 p-2.5 rounded-lg mr-2 hover:bg-blue-500 hover:text-white transition"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDelete(s.id)} className="text-red-500 bg-red-50 p-2.5 rounded-lg hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b flex justify-between bg-gray-50">
                            <h3 className="font-bold text-xl text-gray-800">{formData.id ? 'Sửa Banner' : 'Tải Lên Banner Mới'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            
                            {/* Preview Ảnh Nhỏ */}
                            <div className="w-full h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src='https://placehold.co/800x300?text=Link+ảnh+bị+lỗi'} />
                                ) : (
                                    <span className="text-gray-400 font-medium"><i className="fas fa-image mr-2"></i> Bản xem trước Banner</span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Link URL Hình Ảnh *</label>
                                    <input required type="text" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Dán link ảnh đuôi .jpg, .png vào đây..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700">Tiêu đề (Tùy chọn)</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="VD: Flash Sale Mùa Hè" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Link Đích (Khi click vào)</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="VD: /products?category=1" value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Thứ tự hiển thị (Order)</label>
                                        <input required type="number" min="1" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-center" value={formData.orderNumber} onChange={e => setFormData({...formData, orderNumber: e.target.value})} />
                                        <p className="text-[11px] text-gray-500 mt-1 italic">Số nhỏ hiện trước (1, 2, 3...)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Hủy bỏ</button>
                                <button type="submit" className="flex-1 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg flex items-center justify-center"><i className="fas fa-save mr-2 text-lg"></i> Lưu Banner</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SliderManagement;