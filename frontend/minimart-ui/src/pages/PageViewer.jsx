import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// 1. KHO DỮ LIỆU FIX CỨNG (Không cần gọi Database)
const PAGE_DATA = {
    "chinh-sach-bao-mat": {
        title: "Chính sách bảo mật",
        content: `
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">1. Mục đích và phạm vi thu thập</h3>
            <p class="mb-4 text-justify">Việc thu thập dữ liệu chủ yếu trên hệ thống MiniMart bao gồm: email, điện thoại, tên đăng nhập, mật khẩu khách hàng. Đây là các thông tin mà MiniMart cần khách hàng cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để MiniMart liên hệ xác nhận nhằm đảm bảo quyền lợi cho người tiêu dùng.</p>
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">2. Phạm vi sử dụng thông tin</h3>
            <p class="mb-2">Hệ thống sử dụng thông tin thành viên cung cấp để:</p>
            <ul class="list-disc pl-5 mb-4 space-y-1">
                <li>Cung cấp các dịch vụ đến thành viên.</li>
                <li>Gửi các thông báo về các hoạt động trao đổi thông tin giữa thành viên và hệ thống.</li>
                <li>Ngừa các hoạt động phá hủy tài khoản người dùng của thành viên hoặc các hoạt động giả mạo thành viên.</li>
                <li>Liên lạc và giải quyết với thành viên trong những trường hợp đặc biệt.</li>
            </ul>
        `
    },
    "huong-dan-mua-hang": {
        title: "Hướng dẫn mua hàng",
        content: `
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">Bước 1: Tìm kiếm sản phẩm</h3>
            <p class="mb-4 text-justify">Khách hàng có thể tìm kiếm sản phẩm theo danh mục hoặc sử dụng thanh tìm kiếm trên cùng của trang web.</p>
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">Bước 2: Thêm vào giỏ hàng</h3>
            <p class="mb-4 text-justify">Kiểm tra thông tin sản phẩm, giá cả, chọn số lượng và nhấn nút "Thêm vào giỏ hàng".</p>
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">Bước 3: Đặt hàng và Thanh toán</h3>
            <p class="mb-4 text-justify">Vào biểu tượng giỏ hàng góc trên bên phải, kiểm tra lại danh sách. Điền thông tin địa chỉ giao hàng, chọn phương thức thanh toán phù hợp và nhấn "Đặt hàng". Hệ thống sẽ gửi thông báo "Ting Ting" khi đơn hàng của bạn được xử lý.</p>
        `
    },
    "chinh-sach-doi-tra": {
        title: "Chính sách đổi trả",
        content: `
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">1. Điều kiện đổi trả</h3>
            <p class="mb-4 text-justify">Sản phẩm bị lỗi do nhà sản xuất, hư hỏng trong quá trình vận chuyển, hoặc giao sai sản phẩm so với đơn đặt hàng gốc.</p>
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">2. Thời gian đổi trả</h3>
            <p class="mb-4 text-justify">Hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng thành công được ghi nhận trên hệ thống.</p>
            <h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">3. Quy trình đổi trả</h3>
            <p class="mb-4 text-justify">Vui lòng liên hệ hotline <b class="text-emerald-600">1900 1234</b> hoặc gửi email về <b class="text-emerald-600">contact@minimart.vn</b> kèm theo hình ảnh/video bóc hàng để được nhân viên hỗ trợ nhanh nhất.</p>
        `
    }
};

const PageViewer = () => {
    // 2. Lấy tham số đường dẫn
    const { slug } = useParams();
    const pageInfo = PAGE_DATA[slug];

    // 3. Tự động cuộn lên đầu khi vào trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // 4. Nếu nhập link tào lao thì hiện lỗi 404
    if (!pageInfo) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <i className="fas fa-file-excel text-5xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Trang không tồn tại</h2>
                <p className="text-gray-500 mb-6">Nội dung bạn đang tìm kiếm không có sẵn hoặc đã bị xóa.</p>
                <Link to="/" className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition">
                    Về Trang Chủ
                </Link>
            </div>
        );
    }

    // 5. Hiển thị nội dung chính
    return (
        <div className="bg-gray-50 min-h-[70vh] py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Trang */}
                    <div className="bg-emerald-50 px-8 py-6 border-b border-emerald-100">
                        <h1 className="text-3xl font-bold text-emerald-900">{pageInfo.title}</h1>
                        <div className="flex items-center text-sm text-emerald-600 mt-2">
                            <i className="fas fa-shield-alt mr-2"></i> MiniMart Official Guidelines
                        </div>
                    </div>
                    
                    {/* Nội dung Render từ HTML */}
                    <div className="p-8 text-gray-700 leading-relaxed text-sm md:text-base">
                        <div dangerouslySetInnerHTML={{ __html: pageInfo.content }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageViewer;