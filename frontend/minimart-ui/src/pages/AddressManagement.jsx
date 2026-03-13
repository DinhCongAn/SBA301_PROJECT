import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/addressApi';

const AddressManagement = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({ 
        receiverName: '', phone: '', province: '', city: '', street: '', zipCode: '', isDefault: false 
    });
    const [editingId, setEditingId] = useState(null);

    // Dữ liệu Tỉnh/Huyện/Xã
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedP, setSelectedP] = useState('');
    const [selectedD, setSelectedD] = useState('');
    const [selectedW, setSelectedW] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await getAddresses(user.user_id);
            setAddresses(res.data);
        } catch (err) { console.error("Lỗi tải địa chỉ:", err); }
        setLoading(false);
    };

    useEffect(() => { if(user) loadData(); }, []);

    useEffect(() => {
        if (showModal) {
            axios.get('https://provinces.open-api.vn/api/p/').then(res => setProvinces(res.data));
        }
    }, [showModal]);

    const handleProvinceChange = (e) => {
        const pCode = e.target.value;
        setSelectedP(pCode); setSelectedD(''); setSelectedW(''); setWards([]);
        if(pCode) axios.get(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`).then(res => setDistricts(res.data.districts));
    };

    const handleDistrictChange = (e) => {
        const dCode = e.target.value;
        setSelectedD(dCode); setSelectedW('');
        if(dCode) axios.get(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`).then(res => setWards(res.data.wards));
    };

    const handleOpenAdd = () => {
        setFormData({ 
            receiverName: user.full_name || user.username || '', 
            phone: user.phone || '', 
            province: '', city: '', street: '', zipCode: '', isDefault: false 
        });
        setEditingId(null);
        setSelectedP(''); setSelectedD(''); setSelectedW(''); setSpecificAddress('');
        setShowModal(true);
    };

    const handleOpenEdit = (addr) => {
        setFormData({ 
            receiverName: addr.receiverName, 
            phone: addr.phone, 
            province: addr.province, city: addr.city, street: addr.street, zipCode: addr.zipCode || '', isDefault: addr.isDefault 
        });
        setEditingId(addr.id);
        setSelectedP(''); setSelectedD(''); setSelectedW(''); setSpecificAddress(''); 
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let finalProvince = formData.province;
        let finalCity = formData.city;
        let finalStreet = formData.street;

        if (selectedP && selectedD && selectedW) {
            finalProvince = provinces.find(p => p.code == selectedP)?.name; 
            finalCity = districts.find(d => d.code == selectedD)?.name;     
            const wName = wards.find(w => w.code == selectedW)?.name;       
            finalStreet = `${specificAddress}, ${wName}`;                   
        } else if (!editingId) {
            return alert("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã!");
        } else if (editingId && (selectedP || selectedD || selectedW) && !(selectedP && selectedD && selectedW)) {
            return alert("Vui lòng chọn trọn bộ địa chỉ mới nếu muốn thay đổi!");
        }

        const dataToSubmit = { 
            receiverName: formData.receiverName,
            phone: formData.phone,
            province: finalProvince, 
            city: finalCity, 
            street: finalStreet, 
            zipCode: formData.zipCode,
            isDefault: formData.isDefault 
        };

        try {
            if (editingId) await updateAddress(editingId, dataToSubmit);
            else await addAddress(user.user_id, dataToSubmit);
            setShowModal(false);
            loadData(); 
        } catch (error) { alert('Lỗi lưu địa chỉ!'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa địa chỉ này?")) { await deleteAddress(id); loadData(); }
    };
    const handleSetDefault = async (id) => { await setDefaultAddress(id); loadData(); };

    if (loading) return <div className="text-center py-20 text-emerald-500"><i className="fas fa-spinner fa-spin text-3xl"></i></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Sổ địa chỉ nhận hàng</h2>
                <button onClick={handleOpenAdd} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm">
                    <i className="fas fa-plus mr-1"></i> Thêm địa chỉ mới
                </button>
            </div>
            
            {addresses.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">Bạn chưa có địa chỉ nào. Hãy thêm ngay!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                        <div key={addr.id} className={`bg-white rounded-2xl p-6 relative transition border-2 ${addr.isDefault ? 'border-emerald-500 bg-emerald-50/10 shadow-md' : 'border-gray-100 shadow-sm'}`}>
                            {addr.isDefault && <div className="absolute top-4 right-4 text-emerald-600 text-xs font-bold bg-emerald-100 px-3 py-1.5 rounded-full"><i className="fas fa-check-circle"></i> Mặc định</div>}
                            
                            <h4 className="font-bold text-gray-800 text-lg flex items-center mb-1">
                                {addr.receiverName}
                                <span className="text-gray-300 mx-3">|</span> 
                                <span className="text-gray-500 font-medium text-base"><i className="fas fa-phone-alt text-xs mr-1 text-gray-400"></i> {addr.phone}</span>
                            </h4>
                            
                            <div className="text-gray-600 mt-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="font-medium text-gray-800 mb-1">{addr.street}</p>
                                <p>{addr.city}, {addr.province}</p>
                            </div>
                            
                            <div className="mt-5 flex items-center space-x-4 text-sm font-medium pt-4 border-t border-gray-100">
                                <button onClick={() => handleOpenEdit(addr)} className="text-blue-600 hover:text-blue-700 flex items-center"><i className="fas fa-edit mr-1"></i> Sửa</button>
                                {!addr.isDefault && (
                                    <>
                                        <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-600"><i className="fas fa-trash-alt mr-1"></i> Xóa</button>
                                        <button onClick={() => handleSetDefault(addr.id)} className="text-gray-500 hover:text-emerald-600 ml-auto">Thiết lập mặc định</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL THÊM / SỬA */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-bold mb-6 pb-3 border-b border-gray-100">{editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên người nhận *</label>
                                    <input type="text" required value={formData.receiverName} onChange={(e) => setFormData({...formData, receiverName: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="VD: Nguyễn Văn A" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                    <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="SĐT giao hàng" />
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <label className="block text-sm font-bold text-gray-800 mb-3">Khu vực giao hàng *</label>
                                
                                {editingId && !selectedP && (
                                    <div className="mb-4 text-sm text-gray-600 flex items-start bg-white p-3 rounded-lg border border-gray-200">
                                        <i className="fas fa-map-marker-alt mt-1 mr-2 text-emerald-500"></i>
                                        <div>
                                            <p>Hiện tại: <b>{formData.city}, {formData.province}</b></p>
                                            <p className="text-xs text-gray-400 mt-1">(Bỏ qua 3 ô bên dưới nếu không muốn đổi khu vực)</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <select value={selectedP} onChange={handleProvinceChange} required={!editingId || selectedP} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 bg-white">
                                        <option value="">-- Tỉnh/Thành --</option>
                                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                    </select>
                                    <select value={selectedD} onChange={handleDistrictChange} required={selectedP !== ''} disabled={!selectedP} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 bg-white disabled:bg-gray-100">
                                        <option value="">-- Quận/Huyện --</option>
                                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                    </select>
                                    <select value={selectedW} onChange={(e) => setSelectedW(e.target.value)} required={selectedD !== ''} disabled={!selectedD} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 bg-white disabled:bg-gray-100">
                                        <option value="">-- Phường/Xã --</option>
                                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết (Số nhà, ngõ) *</label>
                                    <input type="text" required value={editingId && !selectedP ? formData.street : specificAddress} onChange={(e) => editingId && !selectedP ? setFormData({...formData, street: e.target.value}) : setSpecificAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="VD: Số 12, Ngõ 34..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã bưu chính</label>
                                    <input type="text" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Không bắt buộc" />
                                </div>
                            </div>
                            
                            <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer bg-gray-50 w-max p-2 px-3 rounded-lg border border-gray-200">
                                <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} className="mr-2 w-4 h-4 text-emerald-500 rounded cursor-pointer" /> Đặt làm địa chỉ mặc định
                            </label>
                            
                            <div className="mt-8 flex justify-end space-x-3 pt-5 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition">Hủy</button>
                                <button type="submit" className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-md">Lưu địa chỉ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressManagement;