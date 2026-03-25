import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../api/authApi';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import PasswordInput from '../components/PasswordInput';
import { validatePasswordStrength } from '../utils/passwordValidation';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        const { isValid } = validatePasswordStrength(newPassword);
        if (!isValid) {
            alert('Mật khẩu không đủ mạnh. Vui lòng kiểm tra các yêu cầu.');
            return;
        }
        try {
            await resetPasswordApi(email, newPassword);
            alert('Cập nhật thành công!');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data || 'Lỗi hệ thống');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Khôi phục mật khẩu</h2>
                <form className="space-y-5 text-left mt-6" onSubmit={handleReset}>
                    <div><label className="block text-sm mb-2">Email đăng ký</label><input type="email" required onChange={(e)=>setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg py-2 px-3" /></div>
                    <PasswordInput 
                        name="newPassword" 
                        value={newPassword} 
                        onChange={(e)=>setNewPassword(e.target.value)} 
                        label="Mật khẩu mới" 
                        placeholder="Í t nhất 8 ký tự" 
                        required 
                    />
                    <PasswordStrengthMeter password={newPassword} />
                    <button type="submit" className="w-full py-3 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600">Xác nhận</button>
                </form>
                <Link to="/login" className="block mt-6 text-sm text-gray-500 hover:text-emerald-600">Quay lại đăng nhập</Link>
            </div>
        </div>
    );
};
export default ForgotPassword;