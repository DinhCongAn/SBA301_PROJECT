import React, { useState, useEffect } from 'react';
import { fetchAdminCategories, saveAdminCategory, deleteAdminCategory, restoreAdminCategory } from '../../api/adminApi';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentTab, setCurrentTab] = useState('active'); 
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null); 
    const [formData, setFormData] = useState({ categoryId: null, name: '', description: '', imageFile: null, imageUrl: '', currentImageUrl: '' });

    const loadData = async (currentSearch = searchTerm) => {
        setLoading(true);
        try {
            const res = await fetchAdminCategories(page, 10, currentSearch, currentTab);
            // Phòng thủ: Bóc tách mảng từ Object phân trang
            const dataArray = res.data?.content ? res.data.content : (Array.isArray(res.data) ? res.data : []);
            setCategories(dataArray);
            setTotalPages(res.data?.totalPages || 0);
            setTotalElements(res.data?.totalElements || 0);
        } catch (error) { 
            console.error("Lỗi:", error); 
            setCategories([]);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [page, currentTab]);
    const handleClearSearch = () => { setSearchTerm(''); setPage(0); loadData(''); };

    const openAddModal = () => {
        setFormData({ categoryId: null, name: '', description: '', imageFile: null, imageUrl: '', currentImageUrl: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        const isBase64 = cat.imageUrl?.startsWith('data:image');
        const urlToEdit = (!isBase64 && cat.imageUrl && !cat.imageUrl.includes('placehold.co')) ? cat.imageUrl : '';
        setFormData({
            categoryId: cat.categoryId, name: cat.name, description: cat.description || '',
            imageFile: null, imageUrl: urlToEdit, currentImageUrl: cat.imageUrl
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return alert("Vui lòng nhập tên danh mục!");

        const data = new FormData();
        if (formData.categoryId) data.append('categoryId', formData.categoryId);
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (formData.imageFile) data.append('image', formData.imageFile); 
        if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);

        try {
            await saveAdminCategory(data);
            setIsModalOpen(false);
            loadData();
            alert(formData.categoryId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        } catch (error) { alert(error.response?.data || "Lỗi lưu danh mục!"); }
    };

    const handleDelete = async (id) => { 
        if(window.confirm("Chuyển danh mục này vào thùng rác?")) { 
            try {
                await deleteAdminCategory(id); 
                loadData(); 
            } catch (error) { alert(error.response?.data || "Lỗi khi xóa!"); }
        } 
    };

    const handleRestore = async (id) => { if(window.confirm("Khôi phục danh mục này?")) { await restoreAdminCategory(id); loadData(); } };

    return (
        <div className="fade-in space-y-6 pb-10 relative">
            {/* Header & Tabs */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h2>
                    <p className="text-gray-500 text-sm">Hệ thống có <span className="font-bold text-emerald-600">{totalElements}</span> danh mục</p>
                </div>
                <button onClick={openAddModal} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 shadow-sm"><i className="fas fa-plus mr-2"></i> Thêm danh mục</button>
            </div>
            {/* --- TABS --- */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button 
                    onClick={() => { setCurrentTab('active'); setPage(0); }} 
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition duration-200 ${currentTab === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <i className="fas fa-tags mr-2"></i> Đang hoạt động
                </button>
                <button 
                    onClick={() => { setCurrentTab('inactive'); setPage(0); }} 
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition duration-200 ${currentTab === 'inactive' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <i className="fas fa-trash-alt mr-2"></i> Thùng rác
                </button>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
                <div className="relative flex-1 flex items-center">
                    <i className="fas fa-search absolute left-4 text-gray-400"></i>
                    <input type="text" placeholder="Tìm tên..." className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadData()} />
                    {searchTerm && <button onClick={handleClearSearch} className="absolute right-4 text-gray-400 hover:text-red-500"><i className="fas fa-times"></i></button>}
                </div>
                <button onClick={() => { setPage(0); loadData(); }} className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900">Tìm</button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <tr><th className="px-6 py-4">Hình ảnh</th><th className="px-6 py-4">Tên danh mục</th><th className="px-6 py-4">Mô tả</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan="4" className="text-center py-12"><i className="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i></td></tr> 
                        : categories.length === 0 ? <tr><td colSpan="4" className="text-center py-12 text-gray-500">Chưa có dữ liệu.</td></tr> 
                        : Array.isArray(categories) && categories.map(cat => (
                            <tr key={cat.categoryId} className={currentTab === 'inactive' ? 'bg-red-50/30' : 'hover:bg-gray-50'}>
                                <td className="px-6 py-4"><img src={cat.imageUrl || 'https://placehold.co/100'} className="w-12 h-12 rounded-lg object-cover border bg-white shadow-sm cursor-pointer hover:opacity-80" onClick={() => setPreviewImage(cat.imageUrl)} alt="cat" /></td>
                                <td className="px-6 py-4 font-bold text-gray-800 text-base">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-600"><p className="line-clamp-2">{cat.description || 'Chưa có mô tả'}</p></td>
                                <td className="px-6 py-4 text-right">
                                    {currentTab === 'active' ? (
                                        <><button onClick={() => openEditModal(cat)} className="text-blue-600 bg-blue-50 p-2.5 rounded-lg mr-2 hover:bg-blue-500 hover:text-white"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => handleDelete(cat.categoryId)} className="text-red-500 bg-red-50 p-2.5 rounded-lg hover:bg-red-500 hover:text-white"><i className="fas fa-trash"></i></button></>
                                    ) : (<button onClick={() => handleRestore(cat.categoryId)} className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 hover:text-white"><i className="fas fa-undo mr-2"></i> Khôi phục</button>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!loading && totalPages > 1 && (
                <div className="p-4 flex justify-between bg-white border-t border-gray-100">
                    <span className="text-sm text-gray-500">Trang <b>{page + 1}</b> / {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 disabled:opacity-50">Trước</button>
                        <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg text-sm bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50">Sau</button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden fade-in">
                        <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-xl">{formData.categoryId ? 'Sửa Danh mục' : 'Thêm Danh mục'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div><label className="block text-sm font-bold mb-2">Tên danh mục *</label><input required className="w-full border rounded-xl p-3 outline-none focus:border-emerald-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                            <div><label className="block text-sm font-bold mb-2">Mô tả</label><textarea rows="3" className="w-full border rounded-xl p-3 outline-none focus:border-emerald-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                            <div className="border-t border-gray-100 pt-5">
                                <label className="block text-sm font-bold mb-3">Hình ảnh đại diện</label>
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                    {(formData.currentImageUrl || formData.imageFile || formData.imageUrl) ? (
                                        <img src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : (formData.imageUrl || formData.currentImageUrl)} className="w-20 h-20 object-cover rounded-xl border bg-white shadow-sm" alt="Preview" />
                                    ) : (<div className="w-20 h-20 bg-white rounded-xl border border-dashed flex items-center justify-center text-gray-300"><i className="fas fa-image text-xl"></i></div>)}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                        <div className={`border p-2.5 rounded-xl bg-white ${formData.imageFile ? 'opacity-40 grayscale' : ''}`}>
                                            <label className="text-[10px] font-bold text-gray-500 block mb-1">Dán Link web:</label>
                                            <input type="text" disabled={!!formData.imageFile} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border rounded p-1.5 text-xs outline-none focus:border-emerald-500" />
                                        </div>
                                        <div className={`border p-2.5 rounded-xl bg-white ${formData.imageUrl ? 'opacity-40 grayscale' : ''}`}>
                                            <label className="text-[10px] font-bold text-gray-500 block mb-1">Tải từ máy tính:</label>
                                            <input type="file" accept="image/*" disabled={!!formData.imageUrl} onChange={e => setFormData({...formData, imageFile: e.target.files[0]})} className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl hover:bg-gray-200">Hủy</button>
                                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600"><i className="fas fa-save mr-2"></i> Lưu Danh mục</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Lightbox */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-3xl w-full flex justify-center items-center" onClick={e => e.stopPropagation()}>
                        <button className="absolute -top-10 right-0 text-white text-3xl hover:text-red-400" onClick={() => setPreviewImage(null)}>&times;</button>
                        <img src={previewImage} alt="Full" className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;