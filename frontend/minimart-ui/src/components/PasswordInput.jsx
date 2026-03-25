import React, { useState } from 'react';

const PasswordInput = ({ 
    name, 
    value, 
    onChange, 
    placeholder = 'Nhập mật khẩu', 
    label = 'Mật khẩu',
    required = false,
    className = 'w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:ring-emerald-500 focus:border-emerald-500'
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input 
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`${className} pr-10`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                    {showPassword ? (
                        <i className="fas fa-eye-slash"></i>
                    ) : (
                        <i className="fas fa-eye"></i>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
