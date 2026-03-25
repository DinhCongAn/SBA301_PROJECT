export const validatePasswordStrength = (password) => {
    const requirements = {
        length: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    return {
        requirements,
        score,
        strength: score <= 2 ? 'weak' : score <= 3 ? 'fair' : score <= 4 ? 'good' : 'strong',
        isValid: score >= 4,
    };
};

export const getPasswordErrorMessages = (requirements) => {
    const messages = [];
    if (!requirements.length) messages.push('Mật khẩu phải có ít nhất 8 ký tự');
    if (!requirements.hasUpperCase) messages.push('Phải có ít nhất 1 chữ hoa (A-Z)');
    if (!requirements.hasLowerCase) messages.push('Phải có ít nhất 1 chữ thường (a-z)');
    if (!requirements.hasNumber) messages.push('Phải có ít nhất 1 số (0-9)');
    if (!requirements.hasSpecialChar) messages.push('Phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
    return messages;
};
