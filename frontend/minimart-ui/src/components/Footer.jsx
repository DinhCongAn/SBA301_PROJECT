import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Vui lòng nhập email của bạn!");
      return;
    }
    toast.success("Cảm ơn bạn đã đăng ký nhận bản tin!");
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4 text-white">
            <i className="fas fa-shopping-basket text-emerald-500 text-2xl mr-2"></i>
            <span className="font-bold text-xl">MiniMart</span>
          </div>
          <p className="text-sm leading-relaxed">
            Hệ thống siêu thị mini thông minh cung cấp thực phẩm tươi sạch với
            dịch vụ giao hàng hỏa tốc.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/page/chinh-sach-bao-mat" className="hover:text-emerald-500 transition">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link to="/page/huong-dan-mua-hang" className="hover:text-emerald-500 transition">
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link to="/page/chinh-sach-doi-tra" className="hover:text-emerald-500 transition">
                Chính sách đổi trả
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Liên hệ</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <i className="fas fa-map-marker-alt mt-1 mr-3 text-emerald-500"></i> ĐH FPT, Hòa Lạc, Hà Nội
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone mr-3 text-emerald-500"></i> 1900 1234
            </li>
            <li className="flex items-center">
              <i className="fas fa-envelope mr-3 text-emerald-500"></i> contact@minimart.vn
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Bản tin</h4>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="px-4 py-2 rounded-l-lg w-full bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 px-4 py-2 rounded-r-lg text-white hover:bg-emerald-600 transition"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-500 italic">
            * Nhận thông báo về khuyến mãi mới nhất.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        © 2026 MiniMart AI - Developed for SE Project FPTU.
      </div>
    </footer>
  );
};

export default Footer;