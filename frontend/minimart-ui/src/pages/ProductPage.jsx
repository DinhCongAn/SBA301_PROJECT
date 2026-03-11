import React, { useEffect, useState } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../api/productApi';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // Lưu sản phẩm đang được sửa (nếu có)

    // 1. Load dữ liệu khi vào trang
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error("Error loading products:", err);
        }
    };

    // 2. Xử lý Thêm hoặc Sửa
    const handleFormSubmit = async (formData) => {
        const payload = {
            ...formData,
            category: { id: formData.categoryId } // Convert sang object Category cho Backend
        };

        try {
            if (editingProduct) {
                // Đang ở chế độ sửa
                await updateProduct(editingProduct.id, payload);
                alert("Cập nhật thành công!");
            } else {
                // Đang ở chế độ thêm
                await addProduct(payload);
                alert("Thêm mới thành công!");
            }
            loadData(); // Load lại bảng
            setEditingProduct(null); // Thoát chế độ sửa
        } catch (err) {
            console.error("Error saving product:", err);
            alert("Có lỗi xảy ra!");
        }
    };

    // 3. Xử lý xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa?")) {
            try {
                await deleteProduct(id);
                loadData();
            } catch (err) {
                console.error("Error deleting:", err);
            }
        }
    };

    // 4. Khi bấm nút Sửa trên bảng
    const handleEdit = (product) => {
        setEditingProduct(product); // Đẩy dữ liệu vào form
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-uppercase mb-4">Quản Lý Sản Phẩm</h2>
            <div className="row">
                {/* Cột trái: Form */}
                <div className="col-md-4">
                    <ProductForm 
                        onSubmit={handleFormSubmit} 
                        initialData={editingProduct} 
                        onCancel={() => setEditingProduct(null)}
                    />
                </div>

                {/* Cột phải: Bảng */}
                <div className="col-md-8">
                    <ProductList 
                        products={products} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductPage;