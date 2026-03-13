import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';

const CustomerLayout = () => {
    return (
        // min-h-screen và flex flex-col giúp Footer luôn bị đẩy xuống đáy màn hình
        <div className="min-h-screen flex flex-col font-sans">
            
            {/* Header luôn cố định ở trên cùng */}
            <Header />

            {/* <Outlet /> chính là cái lỗ hổng. Khi bạn vào trang chủ, nó nhét Home vào đây.
                Khi bạn vào trang sản phẩm, nó rút Home ra và nhét ProductList vào đây. */}
            <main className="flex-grow bg-gray-50">
                <Outlet /> 
            </main>

            {/* Footer luôn cố định ở dưới cùng */}
            <Footer />

            <AIChatbot />
            
        </div>
    );
};

export default CustomerLayout;