import React from 'react';

const ContactWidget = () => {
    // 💡 Đổi số điện thoại và link Zalo thực tế của cửa hàng vào đây
    const phoneNumber = "0932383167"; 
    const zaloLink = "https://zalo.me/00932383167";

    return (
        // 🚀 ĐÃ SỬA: Đẩy lên cao (bottom-28), căn giữa so với nút AI (right-7), và hạ z-index xuống 40 để Cửa sổ Chat đè lên khi mở
        <div className="fixed bottom-28 right-7 z-40 flex flex-col gap-4 items-center fade-in">
            
            {/* 1. NÚT GỌI ĐIỆN (Màu Đỏ - Có hiệu ứng sóng tỏa) */}
            <a 
                href={`tel:${phoneNumber}`}
                className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl shadow-[0_4px_14px_rgba(239,68,68,0.5)] hover:scale-110 transition-transform duration-300 relative group"
                title="Gọi ngay"
            >
                {/* Tooltip hiển thị khi di chuột */}
                <span className="absolute right-16 bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                    Gọi Hotline
                    <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-gray-800 border-b-[5px] border-b-transparent"></div>
                </span>
                
                {/* Hiệu ứng sóng tỏa ra (Ping) */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                
                {/* Icon Điện thoại rung lắc */}
                <i className="fas fa-phone-alt relative z-10 animate-pulse"></i>
            </a>

            {/* 2. NÚT ZALO (Màu Xanh Zalo) */}
            <a 
                href={zaloLink}
                target="_blank" 
                rel="noreferrer" 
                className="w-14 h-14 bg-[#0068FF] rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(0,104,255,0.5)] hover:scale-110 transition-transform duration-300 relative group"
                title="Chat Zalo ngay"
            >
                {/* Tooltip hiển thị khi di chuột */}
                <span className="absolute right-16 bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                    Chat Zalo
                    <div className="absolute right-[-4px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-l-[5px] border-l-gray-800 border-b-[5px] border-b-transparent"></div>
                </span>
                
                {/* Logo Zalo trắng (dùng ảnh mượt hơn font) */}
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png" 
                    alt="Zalo" 
                    className="w-8 h-8 object-contain relative z-10 drop-shadow-md" 
                />
            </a>

        </div>
    );
};

export default ContactWidget;