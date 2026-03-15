import React, { useState, useEffect } from 'react';
import { 
    fetchAdminProducts, deleteAdminProduct, restoreAdminProduct, 
    saveAdminProduct, generateAiProductDesc, fetchAdminCategories 
} from '../../api/adminApi';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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
    
    // 🚀 STATE MỚI: Dùng để hiển thị ảnh phóng to (Lightbox)
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        productId: null, name: '', price: '', stockQuantity: '', categoryId: '', 
        description: '', imageFile: null, imageUrl: '', currentImageUrl: ''
    });

    const [extraImagesList, setExtraImagesList] = useState([]);

    const loadProducts = async (currentSearch = searchTerm) => {
        setLoading(true);
        try {
            const res = await fetchAdminProducts(page, 10, currentSearch, filterCategory, sortBy, currentTab);
            setProducts(res.data.content); 
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    useEffect(() => { loadProducts(); }, [page, filterCategory, sortBy, currentTab]);
    useEffect(() => { fetchAdminCategories().then(res => setCategories(res.data)).catch(console.error); }, []);

    const handleClearSearch = () => { setSearchTerm(''); setPage(0); loadProducts(''); };

    const openAddModal = () => {
        setFormData({ productId: null, name: '', price: '', stockQuantity: '', categoryId: '', description: '', imageFile: null, imageUrl: '', currentImageUrl: '' });
        setExtraImagesList([]); 
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        const isMainBase64 = product.thumbnailUrl?.startsWith('data:image');
        const mainUrl = (!isMainBase64 && product.thumbnailUrl && !product.thumbnailUrl.includes('placehold.co')) 
                        ? product.thumbnailUrl : '';

        setFormData({
            productId: product.productId, name: product.name, price: product.price, stockQuantity: product.stockQuantity,
            categoryId: product.category?.categoryId || '', description: product.description || '',
            imageFile: null, imageUrl: mainUrl, currentImageUrl: product.thumbnailUrl 
        });
        
        const existingExtras = product.images?.map(img => {
            const isExtBase64 = img.imageUrl?.startsWith('data:image');
            return { file: null, url: isExtBase64 ? '' : img.imageUrl, preview: img.imageUrl };
        }) || [];
        
        setExtraImagesList(existingExtras);
        setIsModalOpen(true);
    };

    const addExtraImageRow = () => setExtraImagesList([...extraImagesList, { file: null, url: '', preview: '' }]);
    const removeExtraImageRow = (index) => {
        const newList = [...extraImagesList];
        newList.splice(index, 1);
        setExtraImagesList(newList);
    };
    const handleExtraImageChange = (index, field, value) => {
        const newList = [...extraImagesList];
        newList[index][field] = value;
        if (field === 'file' && value) { newList[index].url = ''; newList[index].preview = URL.createObjectURL(value); }
        if (field === 'url' && value) { newList[index].file = null; newList[index].preview = value; }
        setExtraImagesList(newList);
    };

    const handleDelete = async (id) => { if(window.confirm("Chuyển sản phẩm vào thùng rác?")) { await deleteAdminProduct(id); loadProducts(); } };
    const handleRestore = async (id) => { if(window.confirm("Khôi phục sản phẩm này?")) { await restoreAdminProduct(id); loadProducts(); } };

    const handleGenerateAI = async () => {
        if (!formData.name) return alert("Nhập tên sản phẩm trước để AI viết mô tả!");
        setIsAiLoading(true);
        try {
            const res = await generateAiProductDesc(formData.name);
            setFormData({ ...formData, description: res.data.description });
        } catch (error) { alert("AI bận rồi!"); }
        setIsAiLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return alert("Vui lòng nhập tên sản phẩm!");
        if (formData.price === '' || Number(formData.price) < 0) return alert("Giá bán phải >= 0!");
        if (formData.stockQuantity === '' || Number(formData.stockQuantity) < 0) return alert("Tồn kho phải >= 0!");
        if (!formData.categoryId) return alert("Vui lòng chọn danh mục!");

        const data = new FormData();
        if (formData.productId) data.append('productId', formData.productId);
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('stockQuantity', formData.stockQuantity);
        data.append('categoryId', formData.categoryId);
        data.append('description', formData.description);
        
        if (formData.imageFile) data.append('image', formData.imageFile);
        if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);
        
        extraImagesList.forEach(item => {
            if (item.file) data.append('extraImages', item.file);
            else if (item.url) data.append('extraImageUrls', item.url);
        });

        try {
            await saveAdminProduct(data);
            setIsModalOpen(false);
            loadProducts();
            alert(formData.productId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        } catch (error) { 
            alert(error.response?.data || "Lỗi hệ thống khi lưu!"); 
        }
    };

    return (
        <div className="fade-in space-y-6 pb-10 relative">
            
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Kho hàng</h2>
                    <p className="text-gray-500 text-sm">Đang hiển thị <span className="font-bold text-emerald-600">{totalElements}</span> sản phẩm</p>
                </div>
                <button onClick={openAddModal} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm flex items-center">
                    <i className="fas fa-plus mr-2"></i> Thêm sản phẩm
                </button>
            </div>

            {/* --- TABS --- */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button onClick={() => { setCurrentTab('active'); setPage(0); }} className={`py-3 px-6 font-bold text-sm border-b-2 transition ${currentTab === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <i className="fas fa-box-open mr-2"></i> Đang kinh doanh
                </button>
                <button onClick={() => { setCurrentTab('inactive'); setPage(0); }} className={`py-3 px-6 font-bold text-sm border-b-2 transition ${currentTab === 'inactive' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <i className="fas fa-trash-alt mr-2"></i> Thùng rác (Đã xóa)
                </button>
            </div>

            {/* --- BỘ LỌC --- */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4">
                <div className="flex-1 flex gap-2 min-w-[250px]">
                    <div className="relative flex-1 flex items-center">
                        <i className="fas fa-search absolute left-4 text-gray-400"></i>
                        <input type="text" placeholder="Tìm tên sản phẩm..." className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-emerald-500 outline-none text-sm transition" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadProducts()} />
                        {searchTerm && <button onClick={handleClearSearch} className="absolute right-4 text-gray-400 hover:text-red-500 transition"><i className="fas fa-times"></i></button>}
                    </div>
                    <button onClick={() => { setPage(0); loadProducts(); }} className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition">Tìm</button>
                </div>
                <select className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-emerald-500 font-medium text-gray-700" value={filterCategory} onChange={e => { setPage(0); setFilterCategory(e.target.value); }}>
                    <option value="ALL">Tất cả danh mục</option>
                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                </select>
                <select className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-emerald-500 font-medium text-gray-700" value={sortBy} onChange={e => { setPage(0); setSortBy(e.target.value); }}>
                    <option value="NEWEST">Mới nhất</option>
                    <option value="OLDEST">Cũ nhất</option>
                    <option value="PRICE_ASC">Giá tăng dần</option>
                    <option value="PRICE_DESC">Giá giảm dần</option>
                </select>
            </div>

            {/* --- BẢNG SẢN PHẨM --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr><th className="px-6 py-4">Sản phẩm</th><th className="px-6 py-4">Danh mục</th><th className="px-6 py-4">Giá bán</th><th className="px-6 py-4 text-center">Tồn kho</th><th className="px-6 py-4 text-right">Thao tác</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan="5" className="text-center py-12"><i className="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i></td></tr> 
                            : products.length === 0 ? <tr><td colSpan="5" className="text-center py-12 text-gray-500">Không có dữ liệu.</td></tr> 
                            : products.map(p => (
                                <tr key={p.productId} className={currentTab === 'inactive' ? 'bg-red-50/30' : 'hover:bg-gray-50 transition'}>
                                    <td className="px-6 py-4 flex items-center">
                                        {/* 🚀 Click ảnh trong bảng để xem to */}
                                        <img 
                                            src={p.thumbnailUrl || 'https://placehold.co/100'} 
                                            className="w-12 h-12 rounded-lg object-cover mr-4 border border-gray-100 bg-white shadow-sm cursor-pointer hover:opacity-80 transition" 
                                            alt="sp" 
                                            onClick={() => setPreviewImage(p.thumbnailUrl)}
                                            title="Bấm để xem ảnh lớn"
                                        />
                                        <span className="font-bold text-gray-800 line-clamp-2 w-48">{p.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium"><span className="px-3 py-1 bg-gray-100 rounded-lg text-xs">{p.category?.name || 'N/A'}</span></td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">{p.price?.toLocaleString('vi-VN')}đ</td>
                                    <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1.5 rounded-md text-xs font-bold ${p.stockQuantity <= 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>{p.stockQuantity}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        {currentTab === 'active' ? (
                                            <>
                                                <button onClick={() => openEditModal(p)} className="text-blue-600 bg-blue-50 p-2.5 rounded-lg mr-2 hover:bg-blue-500 hover:text-white transition" title="Sửa"><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDelete(p.productId)} className="text-red-500 bg-red-50 p-2.5 rounded-lg hover:bg-red-500 hover:text-white transition" title="Xóa"><i className="fas fa-trash"></i></button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleRestore(p.productId)} className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 hover:text-white transition shadow-sm"><i className="fas fa-undo mr-2"></i> Khôi phục</button>
                                        )}
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
                            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">Trước</button>
                            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-sm disabled:opacity-50">Sau</button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODAL THÊM / SỬA --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-xl text-gray-800">{formData.productId ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm mới'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl transition">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm *</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (đ) *</label><input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-2">Tồn kho *</label><input required type="number" min="0" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition" /></div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục *</label>
                                    <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition">
                                        <option value="" disabled>Chọn danh mục</option>
                                        {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-gray-700">Mô tả sản phẩm</label>
                                    <button type="button" onClick={handleGenerateAI} disabled={isAiLoading} className="text-xs bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-4 py-1.5 rounded-lg font-bold border border-emerald-200 hover:shadow-md transition flex items-center">
                                        {isAiLoading ? <i className="fas fa-spinner fa-spin mr-1.5"></i> : <span className="mr-1.5 text-base">✨</span>}
                                        {isAiLoading ? "AI đang suy nghĩ..." : "Viết tự động bằng AI"}
                                    </button>
                                </div>
                                <textarea rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm leading-relaxed transition"></textarea>
                            </div>
                            
                            {/* --- QUẢN LÝ ẢNH --- */}
                            <div className="border-t border-gray-100 pt-5">
                                <label className="block text-base font-bold mb-4 text-gray-800 flex items-center">
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-2"><i className="fas fa-images"></i></div>
                                    Bộ sưu tập hình ảnh
                                </label>
                                
                                {/* 1. ẢNH ĐẠI DIỆN */}
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl mb-6">
                                    <label className="text-sm font-bold text-gray-800 block mb-1">Ảnh đại diện chính <span className="text-red-500">*</span></label>
                                    <p className="text-[11px] text-gray-500 mb-3 italic">Bấm vào ảnh thu nhỏ để xem bản phóng to.</p>
                                    
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        {/* 🚀 Click ảnh chính để xem to */}
                                        {(formData.currentImageUrl || formData.imageFile || formData.imageUrl) ? (
                                            <img 
                                                src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : (formData.imageUrl || formData.currentImageUrl)} 
                                                className="w-24 h-24 object-cover rounded-xl border-2 border-emerald-200 bg-white shadow-sm flex-shrink-0 cursor-pointer hover:opacity-80 transition" 
                                                alt="Preview" 
                                                onClick={() => setPreviewImage(formData.imageFile ? URL.createObjectURL(formData.imageFile) : (formData.imageUrl || formData.currentImageUrl))}
                                                title="Bấm để xem lớn"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-white rounded-xl border-2 border-dashed border-gray-300 flex-shrink-0 flex items-center justify-center text-gray-300"><i className="fas fa-image text-2xl"></i></div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                            <div className={`border border-gray-200 p-3 rounded-xl bg-white transition ${formData.imageFile ? 'opacity-40 grayscale' : 'hover:border-emerald-300'}`}>
                                                <label className="text-[11px] font-bold text-gray-600 block mb-1.5">Dán Link ảnh web:</label>
                                                <input type="text" disabled={!!formData.imageFile} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs transition" />
                                            </div>
                                            <div className={`border border-gray-200 p-3 rounded-xl bg-white transition ${formData.imageUrl ? 'opacity-40 grayscale' : 'hover:border-emerald-300'}`}>
                                                <label className="text-[11px] font-bold text-gray-600 block mb-1.5">Hoặc tải từ máy tính:</label>
                                                <input type="file" accept="image/*" disabled={!!formData.imageUrl} onChange={e => setFormData({...formData, imageFile: e.target.files[0]})} className="w-full text-[11px] text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:font-bold file:bg-emerald-50 file:text-emerald-700 cursor-pointer transition" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. ẢNH PHỤ GALLERY */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <label className="text-sm font-bold text-gray-800 block">Ảnh kèm theo (Gallery)</label>
                                        </div>
                                        <button type="button" onClick={addExtraImageRow} className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center shadow-sm">
                                            <i className="fas fa-plus mr-1.5"></i> Thêm hàng ảnh
                                        </button>
                                    </div>
                                    
                                    {extraImagesList.length === 0 ? (
                                        <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-medium bg-gray-50/50">Chưa có ảnh phụ. Bấm nút "Thêm hàng ảnh".</div>
                                    ) : (
                                        <div className="space-y-3">
                                            {extraImagesList.map((item, index) => (
                                                <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm fade-in hover:border-blue-300 transition">
                                                    
                                                    {/* 🚀 Click ảnh phụ để xem to */}
                                                    {item.preview ? (
                                                        <img 
                                                            src={item.preview} 
                                                            className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0 cursor-pointer hover:opacity-80 transition" 
                                                            alt="pre" 
                                                            onClick={() => setPreviewImage(item.preview)}
                                                            title="Bấm để xem lớn"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-200 border-dashed flex-shrink-0 flex items-center justify-center text-gray-300 text-sm"><i className="fas fa-image"></i></div>
                                                    )}
                                                    
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                                        <input type="text" placeholder="Dán link URL web..." disabled={!!item.file} value={item.url} onChange={e => handleExtraImageChange(index, 'url', e.target.value)} className={`w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 transition ${item.file ? 'opacity-40 bg-gray-50' : ''}`} />
                                                        <input type="file" accept="image/*" disabled={!!item.url} onChange={e => handleExtraImageChange(index, 'file', e.target.files[0])} className={`w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 cursor-pointer ${item.url ? 'opacity-40 bg-gray-50 pointer-events-none' : ''}`} />
                                                    </div>

                                                    <button type="button" onClick={() => removeExtraImageRow(index)} className="w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition flex-shrink-0">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3 border-t border-gray-100 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 font-bold text-gray-700 rounded-xl hover:bg-gray-200 transition">Hủy bỏ</button>
                                <button type="submit" className="flex-1 py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg flex items-center justify-center">
                                    <i className="fas fa-save mr-2 text-lg"></i> {formData.productId ? 'Cập nhật Sản phẩm' : 'Lưu Sản phẩm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* 🚀 LIGHTBOX XEM ẢNH TOÀN MÀN HÌNH 🚀        */}
            {/* ========================================== */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-in cursor-zoom-out"
                    onClick={() => setPreviewImage(null)} // Bấm ra ngoài khoảng đen sẽ tự đóng
                >
                    <div className="relative max-w-5xl w-full flex justify-center items-center">
                        <button 
                            className="absolute -top-12 right-0 text-white hover:text-red-400 text-4xl transition duration-200 cursor-pointer"
                            onClick={() => setPreviewImage(null)}
                        >
                            &times;
                        </button>
                        <img 
                            src={previewImage} 
                            alt="Preview Full" 
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl cursor-default"
                            onClick={(e) => e.stopPropagation()} // Chống đóng khi lỡ tay bấm đè lên ảnh
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;