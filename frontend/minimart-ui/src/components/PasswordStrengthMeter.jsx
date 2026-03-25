import React from 'react';
import { validatePasswordStrength, getPasswordErrorMessages } from '../utils/passwordValidation';

const PasswordStrengthMeter = ({ password }) => {
    const { requirements, score, strength } = validatePasswordStrength(password);
    const errorMessages = getPasswordErrorMessages(requirements);

    const strengthColors = {
        weak: 'bg-red-500',
        fair: 'bg-yellow-500',
        good: 'bg-blue-500',
        strong: 'bg-green-500',
    };

    const strengthLabels = {
        weak: 'Yếu',
        fair: 'Khá',
        good: 'Tốt',
        strong: 'Rất mạnh',
    };

    if (!password) return null;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Độ mạnh mật khẩu:</span>
                <span className={`text-sm font-bold ${strength === 'strong' ? 'text-green-600' : strength === 'good' ? 'text-blue-600' : strength === 'fair' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {strengthLabels[strength]}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={`h-2 rounded-full transition-all ${strengthColors[strength]}`}
                    style={{ width: `${(score / 5) * 100}%` }}
                ></div>
            </div>
            {errorMessages.length > 0 && (
                <div className="bg-red-50 rounded-lg p-3 space-y-1">
                    {errorMessages.map((msg, idx) => (
                        <div key={idx} className="text-xs text-red-600 flex items-start">
                            <span className="mr-2 mt-0.5">✗</span>
                            <span>{msg}</span>
                        </div>
                    ))}
                </div>
            )}
            {errorMessages.length === 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-green-600 flex items-center">
                        <span className="mr-2">✓</span>
                        <span>Mật khẩu đủ mạnh!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthMeter;
