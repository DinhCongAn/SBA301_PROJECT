import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
    // Khởi tạo state cho form
    const defaultState = { name: "", price: "", stockQuantity: "", categoryId: 1 };
    const [formData, setFormData] = useState(defaultState);

    // Khi props "initialData" thay đổi (tức là người dùng bấm nút Sửa), 
    // cập nhật form theo dữ liệu đó.
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                price: initialData.price,
                stockQuantity: initialData.stockQuantity,
                categoryId: initialData.category?.id || 1
            });
        } else {
            setFormData(defaultState);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Gửi dữ liệu ngược lên cha
        setFormData(defaultState); // Reset form
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
                <h5 className="mb-0">{initialData ? "Cập Nhật Sản Phẩm" : "Thêm Mới Sản Phẩm"}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên sản phẩm</label>
                        <input 
                            type="text" className="form-control" required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Giá</label>
                            <input 
                                type="number" className="form-control" required
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Số lượng tồn</label>
                            <input 
                                type="number" className="form-control" required
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Danh mục (ID)</label>
                        <select 
                            className="form-select"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        >
                            {/* Sau này bạn sẽ gọi API lấy danh sách Category để đổ vào đây */}
                            <option value="1">Đồ uống (ID: 1)</option>
                            <option value="2">Đồ ăn nhanh (ID: 2)</option>
                        </select>
                    </div>

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                            {initialData ? "Lưu Thay Đổi" : "Thêm Mới"}
                        </button>
                        {initialData && (
                            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                                Hủy Bỏ
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;