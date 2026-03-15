import React, { useState, useEffect } from 'react';
import { fetchAdminProducts, deleteAdminProduct, restoreAdminProduct, saveAdminProduct, generateAiProductDesc, fetchAllCategoriesSimple } from '../../api/adminApi';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Chứa mảng danh mục an toàn
    const [loading, setLoading] = useState(true);

    const [currentTab, setCurrentTab] = useState('active'); 
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [sortBy, setSortBy] = useState('NEWEST');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        productId: null, name: '', price: '', stockQuantity: '', categoryId: '', description: '', imageFile: null, imageUrl: '', currentImageUrl: ''
    });
    const [extraImagesList, setExtraImagesList] = useState([]);

    // Tải Sản phẩm (Phân trang)
    const loadProducts = async (currentSearch = searchTerm) => {
        setLoading(true);
        try {
            const res = await fetchAdminProducts(page, 10, currentSearch, filterCategory, sortBy, currentTab);
            setProducts(res.data?.content || []); 
            setTotalPages(res.data?.totalPages || 0);
            setTotalElements(res.data?.totalElements || 0);
        } catch (error) { setProducts([]); }
        setLoading(false);
    };

    // 🚀 LẤY MẢNG DANH MỤC CHO DROPDOWN (Chống lỗi map is not a function)
    useEffect(() => { 
        fetchAllCategoriesSimple().then(res => {
            const dataArray = Array.isArray(res.data) ? res.data : (res.data?.content || []);
            setCategories(dataArray);
        }).catch(() => setCategories([])); 
    }, []);

    useEffect(() => { loadProducts(); }, [page, filterCategory, sortBy, currentTab]);
    const handleClearSearch = () => { setSearchTerm(''); setPage(0); loadProducts(''); };

    const openAddModal = () => {
        setFormData({ productId: null, name: '', price: '', stockQuantity: '', categoryId: '', description: '', imageFile: null, imageUrl: '', currentImageUrl: '' });
        setExtraImagesList([]); setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        const isMainBase64 = product.thumbnailUrl?.startsWith('data:image');
        const mainUrl = (!isMainBase64 && product.thumbnailUrl && !product.thumbnailUrl.includes('placehold.co')) ? product.thumbnailUrl : '';
        setFormData({
            productId: product.productId, name: product.name, price: product.price, stockQuantity: product.stockQuantity,
            categoryId: product.category?.categoryId || '', description: product.description || '', imageFile: null, imageUrl: mainUrl, currentImageUrl: product.thumbnailUrl 
        });
        const existingExtras = product.images?.map(img => {
            const isExtBase64 = img.imageUrl?.startsWith('data:image');
            return { file: null, url: isExtBase64 ? '' : img.imageUrl, preview: img.imageUrl };
        }) || [];
        setExtraImagesList(existingExtras); setIsModalOpen(true);
    };

    const addExtraImageRow = () => setExtraImagesList([...extraImagesList, { file: null, url: '', preview: '' }]);
    const removeExtraImageRow = (index) => {
        const newList = [...extraImagesList]; newList.splice(index, 1); setExtraImagesList(newList);
    };
    const handleExtraImageChange = (index, field, value) => {
        const newList = [...extraImagesList]; newList[index][field] = value;
        if (field === 'file' && value) { newList[index].url = ''; newList[index].preview = URL.createObjectURL(value); }
        if (field === 'url' && value) { newList[index].file = null; newList[index].preview = value; }
        setExtraImagesList(newList);
    };

    const handleDelete = async (id) => { if(window.confirm("Chuyển sản phẩm vào thùng rác?")) { await deleteAdminProduct(id); loadProducts(); } };
    const handleRestore = async (id) => { if(window.confirm("Khôi phục sản phẩm này?")) { await restoreAdminProduct(id); loadProducts(); } };

    const handleGenerateAI = async () => {
        if (!formData.name) return alert("Nhập tên sản phẩm để AI viết mô tả!");
        setIsAiLoading(true);
        try {
            const res = await generateAiProductDesc(formData.name);
            setFormData({ ...formData, description: res.data.description });
        } catch (error) { alert("AI bận rồi!"); }
        setIsAiLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return alert("Nhập tên sản phẩm!");
        if (!formData.categoryId) return alert("Chọn danh mục!");

        const data = new FormData();
        if (formData.productId) data.append('productId', formData.productId);
        data.append('name', formData.name); data.append('price', formData.price); data.append('stockQuantity', formData.stockQuantity); data.append('categoryId', formData.categoryId); data.append('description', formData.description);
        if (formData.imageFile) data.append('image', formData.imageFile); if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);
        extraImagesList.forEach(item => { if (item.file) data.append('extraImages', item.file); else if (item.url) data.append('extraImageUrls', item.url); });

        try {
            await saveAdminProduct(data); setIsModalOpen(false); loadProducts(); alert("Lưu thành công!");
        } catch (error) { alert(error.response?.data || "Lỗi hệ thống!"); }
    };

    return (
        <div className="fade-in space-y-6 pb-10 relative">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-gray-800">Quản lý Kho hàng</h2><p className="text-gray-500 text-sm">Hiển thị <span className="font-bold text-emerald-600">{totalElements}</span> sản phẩm</p></div>
                <button onClick={openAddModal} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600"><i className="fas fa-plus mr-2"></i> Thêm sản phẩm</button>
            </div>

            {/* --- TABS --- */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button 
                    onClick={() => { setCurrentTab('active'); setPage(0); }} 
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition duration-200 ${currentTab === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <i className="fas fa-box-open mr-2"></i> Đang kinh doanh
                </button>
                <button 
                    onClick={() => { setCurrentTab('inactive'); setPage(0); }} 
                    className={`py-3 px-6 font-bold text-sm border-b-2 transition duration-200 ${currentTab === 'inactive' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <i className="fas fa-trash-alt mr-2"></i> Thùng rác
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4">
                <div className="flex-1 flex gap-2 min-w-[250px]">
                    <div className="relative flex-1 flex items-center">
                        <i className="fas fa-search absolute left-4 text-gray-400"></i>
                        <input type="text" placeholder="Tìm tên..." className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-xl outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadProducts()} />
                        {searchTerm && <button onClick={handleClearSearch} className="absolute right-4 text-gray-400 hover:text-red-500"><i className="fas fa-times"></i></button>}
                    </div>
                    <button onClick={() => { setPage(0); loadProducts(); }} className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold">Tìm</button>
                </div>
                
                {/* Lớp phòng thủ Array.isArray ở bộ lọc */}
                <select className="py-2.5 px-4 bg-gray-50 border rounded-xl outline-none text-sm" value={filterCategory} onChange={e => { setPage(0); setFilterCategory(e.target.value); }}>
                    <option value="ALL">Tất cả danh mục</option>
                    {Array.isArray(categories) && categories.map(c => (<option key={c.categoryId} value={c.categoryId}>{c.name}</option>))}
                </select>

                <select className="py-2.5 px-4 bg-gray-50 border rounded-xl outline-none text-sm" value={sortBy} onChange={e => { setPage(0); setSortBy(e.target.value); }}>
                    <option value="NEWEST">Mới nhất</option><option value="OLDEST">Cũ nhất</option><option value="PRICE_ASC">Giá tăng dần</option><option value="PRICE_DESC">Giá giảm dần</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr><th className="px-6 py-4">Sản phẩm</th><th className="px-6 py-4">Danh mục</th><th className="px-6 py-4">Giá bán</th><th className="px-6 py-4 text-center">Tồn kho</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan="5" className="text-center py-12"><i className="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i></td></tr> 
                            : products.length === 0 ? <tr><td colSpan="5" className="text-center py-12 text-gray-500">Trống.</td></tr> 
                            : products.map(p => (
                                <tr key={p.productId} className={currentTab === 'inactive' ? 'bg-red-50/30' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 flex items-center">
                                        <img src={p.thumbnailUrl || 'https://placehold.co/100'} className="w-12 h-12 rounded-lg object-cover mr-4 border cursor-pointer hover:opacity-80" onClick={() => setPreviewImage(p.thumbnailUrl)} alt="sp" />
                                        <span className="font-bold text-gray-800 line-clamp-2 w-48">{p.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium"><span className="px-3 py-1 bg-gray-100 rounded-lg text-xs">{p.category?.name || 'N/A'}</span></td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">{p.price?.toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1.5 rounded-md text-xs font-bold ${p.stockQuantity <= 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>{p.stockQuantity}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        {currentTab === 'active' ? (
                                            <><button onClick={() => openEditModal(p)} className="text-blue-600 bg-blue-50 p-2.5 rounded-lg mr-2"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(p.productId)} className="text-red-500 bg-red-50 p-2.5 rounded-lg"><i className="fas fa-trash"></i></button></>
                                        ) : (<button onClick={() => handleRestore(p.productId)} className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold"><i className="fas fa-undo mr-2"></i> Khôi phục</button>)}
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
                            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg text-sm bg-emerald-500 text-white disabled:opacity-50">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden fade-in">
                        <div className="px-6 py-5 border-b flex justify-between bg-gray-50">
                            <h3 className="font-bold text-xl">{formData.productId ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                            <div><label className="block text-sm font-bold mb-2">Tên sản phẩm *</label><input required className="w-full border rounded-xl p-3 outline-none focus:border-emerald-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="block text-sm font-bold mb-2">Giá (đ) *</label><input required type="number" min="0" className="w-full border rounded-xl p-3 outline-none focus:border-emerald-500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                                <div><label className="block text-sm font-bold mb-2">Kho *</label><input required type="number" min="0" className="w-full border rounded-xl p-3 outline-none focus:border-emerald-500" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} /></div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Danh mục *</label>
                                    {/* 🚀 Lớp phòng thủ Array.isArray trong Modal */}
                                    <select required className="w-full border rounded-xl p-3 outline-none focus:border-emerald-500" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                                        <option value="" disabled>Chọn danh mục</option>
                                        {Array.isArray(categories) && categories.map(c => (<option key={c.categoryId} value={c.categoryId}>{c.name}</option>))}
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold">Mô tả</label>
                                    <button type="button" onClick={handleGenerateAI} disabled={isAiLoading} className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-bold"><i className="fas fa-magic"></i> AI Viết</button>
                                </div>
                                <textarea rows="3" required className="w-full border rounded-xl p-4 outline-none focus:border-emerald-500 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            
                            <div className="border-t pt-5">
                                <label className="block font-bold mb-4"><i className="fas fa-images text-emerald-600 mr-2"></i>Hình ảnh</label>
                                <div className="p-4 bg-gray-50 border rounded-2xl mb-6">
                                    <label className="text-sm font-bold block mb-2">1. Ảnh chính *</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        {(formData.currentImageUrl || formData.imageFile || formData.imageUrl) ? (
                                            <img src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : (formData.imageUrl || formData.currentImageUrl)} className="w-20 h-20 object-cover rounded-xl border bg-white shadow-sm cursor-pointer" alt="Preview" onClick={() => setPreviewImage(formData.imageFile ? URL.createObjectURL(formData.imageFile) : (formData.imageUrl || formData.currentImageUrl))} />
                                        ) : (<div className="w-20 h-20 bg-white rounded-xl border border-dashed flex items-center justify-center text-gray-300"><i className="fas fa-image text-2xl"></i></div>)}
                                        <div className="grid grid-cols-2 gap-3 w-full">
                                            <div className={`border p-2 rounded-xl bg-white ${formData.imageFile ? 'opacity-40' : ''}`}><label className="text-[10px] font-bold block mb-1">Dán Link:</label><input type="text" disabled={!!formData.imageFile} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border rounded p-1 text-xs" /></div>
                                            <div className={`border p-2 rounded-xl bg-white ${formData.imageUrl ? 'opacity-40' : ''}`}><label className="text-[10px] font-bold block mb-1">Tải lên:</label><input type="file" accept="image/*" disabled={!!formData.imageUrl} onChange={e => setFormData({...formData, imageFile: e.target.files[0]})} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-emerald-50" /></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-bold">2. Ảnh phụ (Gallery)</label>
                                        <button type="button" onClick={addExtraImageRow} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold"><i className="fas fa-plus"></i> Thêm hàng</button>
                                    </div>
                                    {extraImagesList.length === 0 ? (
                                        <div className="text-center p-6 border-2 border-dashed rounded-xl text-gray-400 text-sm">Chưa có ảnh phụ.</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {extraImagesList.map((item, index) => (
                                                <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border rounded-xl">
                                                    {item.preview ? (<img src={item.preview} className="w-12 h-12 object-cover rounded-lg border cursor-pointer" alt="pre" onClick={() => setPreviewImage(item.preview)}/>) : (<div className="w-12 h-12 bg-gray-50 rounded-lg border border-dashed flex items-center justify-center text-gray-300 text-xs"><i className="fas fa-image"></i></div>)}
                                                    <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                                                        <input type="text" placeholder="Dán link..." disabled={!!item.file} value={item.url} onChange={e => handleExtraImageChange(index, 'url', e.target.value)} className="w-full border rounded p-2 text-xs" />
                                                        <input type="file" accept="image/*" disabled={!!item.url} onChange={e => handleExtraImageChange(index, 'file', e.target.files[0])} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded file:bg-gray-100" />
                                                    </div>
                                                    <button type="button" onClick={() => removeExtraImageRow(index)} className="w-10 h-10 bg-red-50 text-red-500 rounded-lg"><i className="fas fa-trash-alt"></i></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl hover:bg-gray-200">Hủy</button>
                                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600"><i className="fas fa-save mr-2"></i> Lưu Sản phẩm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Lightbox */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-5xl w-full flex justify-center items-center" onClick={e => e.stopPropagation()}>
                        <button className="absolute -top-10 right-0 text-white text-3xl" onClick={() => setPreviewImage(null)}>&times;</button>
                        <img src={previewImage} alt="Full" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;