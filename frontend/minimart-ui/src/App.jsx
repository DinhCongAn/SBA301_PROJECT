import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import CustomerLayout from "./layouts/CustomerLayout";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import AddressManagement from "./pages/AddressManagement";
import ProductDetail from "./pages/ProductDetail";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Routes>
            
            {/* TẤT CẢ CÁC TRANG ĐỀU SỬ DỤNG LAYOUT CÓ HEADER & FOOTER */}
            <Route path="/" element={<CustomerLayout />}>
                
                {/* Trang mua sắm */}
                <Route index element={<Home />} />
                <Route path="products" element={<ProductList />} />
                
                {/* Trang xác thực (Đã được nhúng Header/Footer) */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />

                {/* TÀI KHOẢN CÁ NHÂN */}
                <Route path="profile" element={<Profile />} />
                <Route path="address" element={<AddressManagement />} />
                {/* <Route path="orders" element={<OrderHistory />} /> --> Chừa sẵn sau này làm */}

                <Route path="product/:id" element={<ProductDetail />} />
                
            </Route>

          </Routes>
        </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;