import React, { useState, useEffect } from 'react';
import { fetchAdminUsers, updateUserRole, toggleUserLock } from '../../api/adminApi';

const UserManagement = () => {
    // Lấy thông tin Admin đang đăng nhập để tránh việc Admin tự khóa tài khoản của chính mình
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchAdminUsers(page, 10, searchTerm);
            setUsers(res.data?.content || []);
            setTotalPages(res.data?.totalPages || 0);
            setTotalElements(res.data?.totalElements || 0);
        } catch (error) { console.error("Lỗi tải user:", error); setUsers([]); }
        setLoading(false);
    };

    useEffect(() => { loadUsers(); }, [page]);

    // XỬ LÝ ĐỔI QUYỀN
    const handleRoleChange = async (userId, newRole) => {
        if (currentUser?.user_id === userId) {
            return alert("Bạn không thể tự đổi quyền của chính mình!");
        }
        if (window.confirm(`Xác nhận cấp quyền ${newRole} cho người dùng này?`)) {
            try {
                await updateUserRole(userId, newRole);
                alert("Cập nhật quyền thành công!");
                loadUsers();
            } catch (error) { alert("Lỗi khi đổi quyền!"); }
        }
    };

    // XỬ LÝ KHÓA/MỞ KHÓA
    const handleToggleLock = async (userId, currentStatus) => {
        if (currentUser?.user_id === userId) {
            return alert("Lỗi: Không thể tự khóa tài khoản của chính mình đang đăng nhập!");
        }
        const action = currentStatus ? "KHÓA" : "MỞ KHÓA";
        if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            try {
                const res = await toggleUserLock(userId);
                alert(res.data); // Hiển thị câu thông báo từ Backend
                loadUsers();
            } catch (error) { alert("Lỗi hệ thống!"); }
        }
    };

    return (
        <div className="fade-in space-y-6 pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Người Dùng</h2>
                    <p className="text-gray-500 text-sm">Hệ thống có <span className="font-bold text-emerald-600">{totalElements}</span> thành viên</p>
                </div>
            </div>

            {/* Bộ Lọc / Tìm Kiếm */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
                <div className="relative flex-1">
                    <i className="fas fa-search absolute left-4 top-3 text-gray-400"></i>
                    <input 
                        type="text" 
                        placeholder="Tìm theo Tên, Email hoặc Số điện thoại..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-emerald-500 outline-none text-sm" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && loadUsers()} 
                    />
                </div>
                <button onClick={() => { setPage(0); loadUsers(); }} className="px-6 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition">
                    Tìm kiếm
                </button>
            </div>

            {/* Bảng Dữ Liệu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4">Liên hệ</th>
                                <th className="px-6 py-4 text-center">Vai trò (Role)</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan="6" className="text-center py-12"><i className="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i></td></tr> 
                            : users.length === 0 ? <tr><td colSpan="6" className="text-center py-12 text-gray-500">Không tìm thấy người dùng nào.</td></tr> 
                            : users.map(u => {
                                // Mặc định isActive là true nếu null
                                const isActive = u.isActive !== false; 
                                const isMe = currentUser?.user_id === u.userId; // Cờ kiểm tra xem có phải là mình không

                                return (
                                <tr key={u.userId} className={`transition ${!isActive ? 'bg-red-50/30' : 'hover:bg-gray-50'} ${isMe ? 'bg-blue-50/20' : ''}`}>
                                    <td className="px-6 py-4 font-bold text-gray-500">#{u.userId}</td>
                                    
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img src={u.avatarUrl || "https://placehold.co/100"} alt="avatar" className="w-10 h-10 rounded-full object-cover border mr-3" />
                                            <div>
                                                <p className="font-bold text-gray-800">{u.fullName || u.username} {isMe && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded ml-1">Bạn</span>}</p>
                                                <p className="text-xs text-gray-500">{u.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-6 py-4">
                                        <p className="text-gray-700 text-sm"><i className="fas fa-envelope text-gray-400 w-4"></i> {u.email}</p>
                                        <p className="text-gray-600 text-sm mt-1"><i className="fas fa-phone text-gray-400 w-4"></i> {u.phone || 'N/A'}</p>
                                    </td>
                                    
                                    <td className="px-6 py-4 text-center">
                                        {/* Dropdown Đổi Quyền (Khóa nếu là chính mình) */}
                                        <select 
                                            className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border shadow-sm ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                                            disabled={isMe}
                                            title={isMe ? "Không thể tự đổi quyền của mình" : "Đổi quyền"}
                                        >
                                            <option value="CUSTOMER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {isActive 
                                            ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold"><i className="fas fa-check-circle mr-1"></i> Hoạt động</span>
                                            : <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><i className="fas fa-lock mr-1"></i> Đã Khóa</span>
                                        }
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {/* Nút bấm Khóa / Mở Khóa (Ẩn nếu là chính mình) */}
                                        {!isMe && (
                                            <button 
                                                onClick={() => handleToggleLock(u.userId, isActive)} 
                                                className={`px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                                                title={isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                            >
                                                <i className={`fas ${isActive ? 'fa-ban' : 'fa-unlock'}`}></i> {isActive ? 'Khóa' : 'Mở Khóa'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {!loading && totalPages > 1 && (
                    <div className="p-4 flex justify-between items-center bg-white border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">Trang <b className="text-gray-900">{page + 1}</b> / {totalPages}</span>
                        <div className="flex gap-2">
                            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">Trước</button>
                            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm disabled:opacity-50">Sau</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;