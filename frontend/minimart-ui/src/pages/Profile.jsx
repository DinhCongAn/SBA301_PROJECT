import React, { useState, useEffect } from 'react';
import { updateProfileApi, changePasswordApi } from '../api/userApi';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import PasswordInput from '../components/PasswordInput';
import { validatePasswordStrength } from '../utils/passwordValidation';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    const [profile, setProfile] = useState({ full_name: user.full_name || '', phone: user.phone || '', avatar_url: user.avatar_url || '' });
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState({ text: '', type: '' }); 
    const [activeTab, setActiveTab] = useState('info'); 

    // QUAN TRỌNG: Kiểm tra xem user có phải nhập mật khẩu cũ không
    // Nếu has_password là false (Tức là login Google lần đầu) -> không cần nhập MK cũ
    const needsOldPassword = user.has_password !== false;

    const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
    const handlePassChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return setMessage({ text: 'Ảnh phải nhỏ hơn 2MB', type: 'error' });
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, avatar_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const submitProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfileApi(user.user_id, profile);
            setMessage({ text: 'Cập nhật hồ sơ thành công!', type: 'success' });
            localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
        } catch (error) {
            setMessage({ text: 'Lỗi cập nhật hồ sơ!', type: 'error' });
        }
    };

    const submitPassword = async (e) => {
        e.preventDefault();
        
        // Validate new password strength
        const { isValid } = validatePasswordStrength(passwords.newPassword);
        if (!isValid) return setMessage({ text: 'Mật khẩu không đủ mạnh. Vui lòng kiểm tra các yêu cầu.', type: 'error' });
        
        if (passwords.newPassword !== passwords.confirmPassword) return setMessage({ text: 'Xác nhận mật khẩu không khớp!', type: 'error' });

        try {
            // Gửi API đổi mật khẩu
            await changePasswordApi(user.user_id, passwords);
            setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            
            // XỬ LÝ LOGIC UI: Cập nhật LocalStorage ép has_password = true
            // Để ngay từ lần bấm chuyển tab tiếp theo, nó sẽ yêu cầu MK cũ
            const updatedUser = { ...user, has_password: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
        } catch (error) {
            setMessage({ text: error.response?.data || 'Lỗi đổi mật khẩu!', type: 'error' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quản lý tài khoản</h2>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-gray-50 border-r border-gray-100 p-6 space-y-2">
                    <button onClick={() => {setActiveTab('info'); setMessage({text:'', type:''})}} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'info' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <i className="fas fa-user mr-2"></i> Hồ sơ
                    </button>
                    <button onClick={() => {setActiveTab('password'); setMessage({text:'', type:''})}} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'password' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <i className="fas fa-lock mr-2"></i> Mật khẩu
                    </button>
                </div>

                <div className="md:w-3/4 p-8">
                    {/* TAB HỒ SƠ */}
                    {activeTab === 'info' && (
                        <form onSubmit={submitProfile} className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-100">
                                <img src={profile.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name || 'U'}&background=10b981&color=fff`} className="w-24 h-24 rounded-full shadow-md object-cover" alt="avatar" />
                                <div>
                                    <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm inline-block">
                                        <i className="fas fa-camera mr-2"></i> Đổi ảnh đại diện
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                    <p className="text-xs text-gray-400 mt-2">Dung lượng tối đa 2MB. Định dạng: JPEG, PNG.</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label><input type="text" value={user.username} disabled className="w-full bg-gray-100 border-transparent rounded-lg p-2.5 text-gray-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={user.email || ''} disabled className="w-full bg-gray-100 border-transparent rounded-lg p-2.5 text-gray-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label><input type="text" name="full_name" value={profile.full_name} onChange={handleProfileChange} className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label><input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500" /></div>
                            </div>
                            <button type="submit" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm">Lưu thay đổi</button>
                        </form>
                    )}

                    {/* TAB MẬT KHẨU */}
                    {activeTab === 'password' && (
                        <form onSubmit={submitPassword} className="space-y-5 w-full max-w-md">
                            
                            {/* Khung thông báo cho người dùng Google lần đầu */}
                            {!needsOldPassword && (
                                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm mb-4 border border-blue-100 flex items-start">
                                    <i className="fas fa-info-circle mt-1 mr-3 text-lg"></i>
                                    <p>Bạn đang đăng nhập bằng tài khoản Google nên chưa có mật khẩu riêng. Hãy thiết lập mật khẩu mới bên dưới để bảo mật hơn nhé.</p>
                                </div>
                            )}

                            {/* Nếu bắt buộc nhập mật khẩu cũ thì mới hiện ô này */}
                            {needsOldPassword && (
                                <PasswordInput
                                    name="oldPassword"
                                    value={passwords.oldPassword}
                                    onChange={handlePassChange}
                                    label="Mật khẩu hiện tại"
                                    placeholder="Nhập mật khẩu hiện tại"
                                    required
                                />
                            )}

                            <PasswordInput
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePassChange}
                                label="Mật khẩu mới"
                                placeholder="Ít nhất 8 ký tự"
                                required
                            />
                            <PasswordStrengthMeter password={passwords.newPassword} />

                            <PasswordInput
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handlePassChange}
                                label="Xác nhận mật khẩu mới"
                                placeholder="Nhập lại mật khẩu mới"
                                required
                            />
                            
                            <button type="submit" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm w-full mt-4">
                                {needsOldPassword ? 'Cập nhật mật khẩu' : 'Thiết lập mật khẩu'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;