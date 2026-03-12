import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <div className="flex items-center mb-4 text-white">
            <i className="fas fa-shopping-basket text-primary text-2xl mr-2"></i>
            <span className="font-bold text-xl">MiniMart</span>
          </div>
          <p className="text-sm leading-relaxed">
            Hệ thống siêu thị mini thông minh cung cấp thực phẩm tươi sạch với
            dịch vụ giao hàng hỏa tốc.
          </p>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary transition">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                Hướng dẫn mua hàng
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                Chính sách đổi trả
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Liên hệ
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary"></i>
              ĐH FPT, Hòa Lạc, Hà Nội
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone mr-3 text-primary"></i>
              1900 1234
            </li>
            <li className="flex items-center">
              <i className="fas fa-envelope mr-3 text-primary"></i>
              contact@minimart.vn
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Bản tin
          </h4>
          <div className="flex">
            <input
              type="email"
              placeholder="Email của bạn"
              className="px-4 py-2 rounded-l-lg w-full focus:outline-none text-gray-900 text-sm"
            />
            <button className="bg-primary px-4 py-2 rounded-r-lg text-white hover:bg-primaryHover transition">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        © 2026 MiniMart AI - Developed for SE Project FPTU.
      </div>
    </footer>
  );
};

export default Footer;