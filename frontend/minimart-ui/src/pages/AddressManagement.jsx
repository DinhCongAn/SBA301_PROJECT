import React, { useState } from 'react';

const AddressManagement = () => {
    // Fake data tĩnh để làm giao diện theo yêu cầu
    const [addresses, setAddresses] = useState([
        { id: 1, name: 'Nguyễn Văn An', phone: '0987654321', street: 'Ký túc xá Đại học FPT, Khu Công Nghệ Cao Hòa Lạc', city: 'Thạch Hòa, Thạch Thất, Hà Nội', isDefault: true },
        { id: 2, name: 'Nhà riêng', phone: '0912345678', street: 'Số 1, Đường X, Phường Y', city: 'Quận Cầu Giấy, Hà Nội', isDefault: false }
    ]);

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Sổ địa chỉ nhận hàng</h2>
                <button onClick={() => setShowModal(true)} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition shadow-sm w-max">
                    <i className="fas fa-plus mr-1"></i> Thêm địa chỉ mới
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(addr => (
                    <div key={addr.id} className={`bg-white rounded-2xl shadow-sm p-6 relative transition hover:shadow-md border-2 ${addr.isDefault ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-100'}`}>
                        {addr.isDefault && (
                            <div className="absolute top-4 right-4 text-emerald-600 text-xs font-bold bg-emerald-100 px-3 py-1.5 rounded-full flex items-center">
                                <i className="fas fa-check-circle mr-1"></i> Mặc định
                            </div>
                        )}
                        <h4 className="font-bold text-gray-800 text-lg flex flex-col sm:flex-row sm:items-center mb-1">
                            {addr.name} 
                            <span className="hidden sm:inline text-gray-300 mx-3">|</span> 
                            <span className="text-gray-500 font-medium text-base mt-1 sm:mt-0"><i className="fas fa-phone-alt text-xs mr-1 text-gray-400"></i> {addr.phone}</span>
                        </h4>
                        <div className="text-gray-600 mt-4 text-sm space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p><i className="fas fa-map-marker-alt w-4 text-gray-400"></i> {addr.street}</p>
                            <p className="pl-4">{addr.city}</p>
                        </div>
                        <div className="mt-5 flex items-center space-x-4 text-sm font-medium pt-4 border-t border-gray-100">
                            <button className="text-blue-600 hover:text-blue-700 flex items-center"><i className="fas fa-edit mr-1"></i> Sửa</button>
                            {!addr.isDefault && (
                                <>
                                    <button className="text-red-500 hover:text-red-600 flex items-center"><i className="fas fa-trash-alt mr-1"></i> Xóa</button>
                                    <button className="text-gray-500 hover:text-emerald-600 ml-auto">Thiết lập mặc định</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Thêm Địa chỉ (Chỉ là UI tĩnh) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Thêm địa chỉ mới</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm mb-1">Họ tên</label><input type="text" className="w-full border-gray-300 rounded-lg p-2" /></div>
                                <div><label className="block text-sm mb-1">Số điện thoại</label><input type="text" className="w-full border-gray-300 rounded-lg p-2" /></div>
                            </div>
                            <div><label className="block text-sm mb-1">Tỉnh/Thành phố, Quận/Huyện</label><input type="text" className="w-full border-gray-300 rounded-lg p-2" placeholder="Ví dụ: Cầu Giấy, Hà Nội..." /></div>
                            <div><label className="block text-sm mb-1">Địa chỉ cụ thể (Số nhà, đường...)</label><textarea className="w-full border-gray-300 rounded-lg p-2 h-20"></textarea></div>
                            <label className="flex items-center text-sm"><input type="checkbox" className="mr-2 text-emerald-500 rounded" /> Đặt làm địa chỉ mặc định</label>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium">Hủy bỏ</button>
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600">Lưu địa chỉ</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddressManagement;