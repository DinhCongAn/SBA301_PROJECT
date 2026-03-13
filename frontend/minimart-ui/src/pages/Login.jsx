import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi, googleLoginApi } from '../api/authApi';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSuccessLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.role === 'ADMIN') navigate('/admin');
        else navigate('/');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) return setError('Vui lòng nhập đủ thông tin!');
        setLoading(true);
        try {
            const res = await loginApi(username, password);
            handleSuccessLogin(res.data);
        } catch (err) {
            setError(err.response?.data || 'Đăng nhập thất bại!');
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const res = await googleLoginApi(credentialResponse.credential);
            handleSuccessLogin(res.data);
        } catch (err) {
            setError('Đăng nhập Google thất bại!');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="text-3xl font-extrabold text-emerald-600 mb-6 flex justify-center items-center">
                    <i className="fas fa-shopping-basket mr-2"></i> MiniMart
                </Link>
                <h2 className="text-2xl font-extrabold text-gray-900">Đăng nhập tài khoản</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center text-sm text-gray-900"><input type="checkbox" className="mr-2 text-emerald-600 rounded"/> Ghi nhớ</label>
                        <Link to="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">Quên mật khẩu?</Link>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Hoặc</span></div>
                </div>

                <div className="mt-6 flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Lỗi Popup Google')} useOneTap shape="pill" />
                </div>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Chưa có tài khoản? <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-500">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};
export default Login;