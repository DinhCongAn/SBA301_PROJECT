import React from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Danh Sách Sản Phẩm</h5>
            </div>
            <div className="card-body">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Kho</th>
                            <th>Danh mục</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">Chưa có dữ liệu</td></tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price.toLocaleString()} đ</td>
                                    <td>{product.stockQuantity}</td>
                                    <td>{product.category?.name || "N/A"}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => onEdit(product)}
                                        >
                                            <i className="bi bi-pencil"></i> Sửa
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => onDelete(product.id)}
                                        >
                                            <i className="bi bi-trash"></i> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;