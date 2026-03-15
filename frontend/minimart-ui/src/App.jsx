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
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrderManagement from "./pages/admin/OrderManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import PromotionManagement from "./pages/admin/PromotionManagement";
import UserManagement from "./pages/admin/UserManagement";

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
                

                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* =============================== */}
        {/* ROUTES DÀNH CHO ADMIN           */}
        {/* =============================== */}
        <Route path="/admin" element={<AdminLayout />}>
          
          {/* Khi URL là "/admin", nó sẽ nhúng AdminDashboard vào chỗ <Outlet /> */}
          <Route index element={<AdminDashboard />} /> 
          
          {/* Khi URL là "/admin/products", nó nhúng ProductManagement vào <Outlet /> */}
          <Route path="products" element={<ProductManagement />} />

          <Route path="categories" element={<CategoryManagement />} />
          
          {/* Tương tự cho đơn hàng */}
          <Route path="orders" element={<OrderManagement />} />
          <Route path="promotions" element={<PromotionManagement />} />
          <Route path="users" element={<UserManagement />} />
          
        </Route>
                
            </Route>

          </Routes>
        </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;