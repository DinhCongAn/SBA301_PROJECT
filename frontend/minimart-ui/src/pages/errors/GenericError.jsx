import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// TỪ ĐIỂN LỖI (Giống y hệt Switch-Case của bạn)
const ERROR_DICTIONARY = {
    400: { title: "Yêu cầu không hợp lệ", message: "Dữ liệu gửi lên không đúng định dạng hoặc thiếu tham số.", icon: "fa-ban", color: "text-orange-500" },
    401: { title: "Chưa xác thực", message: "Bạn cần đăng nhập để truy cập tài nguyên này.", icon: "fa-lock", color: "text-gray-500" },
    403: { title: "Truy cập bị từ chối", message: "Bạn không có quyền (Role) để truy cập vào trang này.", icon: "fa-user-shield", color: "text-red-500" },
    404: { title: "Không tìm thấy trang", message: "Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.", icon: "fa-search-minus", color: "text-gray-400" },
    405: { title: "Phương thức không được hỗ trợ", message: "Phương thức HTTP không được phép cho URL này.", icon: "fa-hand-paper", color: "text-orange-500" },
    408: { title: "Hết thời gian yêu cầu", message: "Yêu cầu của bạn mất quá nhiều thời gian để xử lý.", icon: "fa-hourglass-end", color: "text-yellow-600" },
    409: { title: "Xung đột dữ liệu", message: "Dữ liệu bị xung đột, vui lòng kiểm tra lại.", icon: "fa-random", color: "text-orange-600" },
    500: { title: "Lỗi máy chủ", message: "Hệ thống gặp sự cố nội bộ. Vui lòng thử lại sau.", icon: "fa-server", color: "text-red-600" },
    502: { title: "Bad Gateway", message: "Máy chủ nhận phản hồi không hợp lệ từ dịch vụ khác.", icon: "fa-network-wired", color: "text-red-500" },
    503: { title: "Dịch vụ không khả dụng", message: "Hệ thống đang bảo trì hoặc quá tải (Server Backend đang tắt).", icon: "fa-tools", color: "text-yellow-600" },
    504: { title: "Gateway Timeout", message: "Máy chủ phản hồi quá chậm.", icon: "fa-clock", color: "text-red-400" }
};

const GenericError = ({ defaultCode }) => {
    const params = useParams();
    const navigate = useNavigate();
    
    // Nếu có mã từ URL thì dùng, không thì dùng defaultCode (VD: lỗi 404 gõ sai link)
    const code = params.code || defaultCode || "500"; 

    // Tìm lỗi trong từ điển, nếu mã lạ thì hiện lỗi mặc định
    const errorData = ERROR_DICTIONARY[code] || {
        title: "Lỗi không xác định",
        message: "Có lỗi xảy ra. Vui lòng liên hệ bộ phận hỗ trợ.",
        icon: "fa-exclamation-triangle",
        color: "text-gray-600"
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 relative overflow-hidden">
            {/* Background Icon làm mờ */}
            <div className={`absolute ${errorData.color} text-[250px] opacity-5`}>
                <i className={`fas ${errorData.icon}`}></i>
            </div>
            
            {/* Nội dung báo lỗi */}
            <h1 className={`text-7xl md:text-9xl font-black ${errorData.color} drop-shadow-md z-10`}>
                {code}
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mt-6 z-10 text-center">
                {errorData.title}
            </h2>
            <p className="text-gray-500 mt-4 text-center max-w-md z-10 text-lg">
                {errorData.message}
            </p>
            
            {/* Nút hành động */}
            <div className="flex flex-wrap justify-center gap-4 mt-10 z-10">
                <button onClick={() => navigate(-1)} className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl transition shadow-sm">
                    <i className="fas fa-arrow-left mr-2"></i> Quay lại trang trước
                </button>
                <button onClick={() => window.location.href = '/'} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-sm">
                    <i className="fas fa-home mr-2"></i> Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default GenericError;