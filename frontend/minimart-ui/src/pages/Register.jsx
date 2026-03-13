import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api/authApi';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', username: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return setError('Mật khẩu không khớp!');
        if (formData.password.length < 6) return setError('Mật khẩu > 6 ký tự!');
        
        try {
            await registerApi(formData);
            alert('Đăng ký thành công!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Lỗi đăng ký!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-xl bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Tạo tài khoản mới</h2>
                <form className="space-y-5" onSubmit={handleRegister}>
                    {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-gray-700">Họ tên</label><input type="text" required name="fullName" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" /></div>
                        <div><label className="block text-sm text-gray-700">Username</label><input type="text" required name="username" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-gray-700">Email</label><input type="email" required name="email" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" /></div>
                        <div><label className="block text-sm text-gray-700">SĐT</label><input type="text" name="phone" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-gray-700">Mật khẩu</label><input type="password" required name="password" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" /></div>
                        <div><label className="block text-sm text-gray-700">Xác nhận MK</label><input type="password" required name="confirmPassword" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3" /></div>
                    </div>
                    <button type="submit" className="w-full py-3 mt-6 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600">Đăng ký</button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">Đã có tài khoản? <Link to="/login" className="font-bold text-emerald-600">Đăng nhập</Link></div>
            </div>
        </div>
    );
};
export default Register;