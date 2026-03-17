import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- BẢO VỆ ROUTE ---
import AdminRoute from "./components/AdminRoute";

// --- LAYOUTS ---
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

// --- CUSTOMER PAGES ---
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

// --- ADMIN PAGES ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrderManagement from "./pages/admin/OrderManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import PromotionManagement from "./pages/admin/PromotionManagement";
import UserManagement from "./pages/admin/UserManagement";
import SliderManagement from "./pages/admin/SliderManagement";
import ReviewManagement from "./pages/admin/ReviewManagement";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Routes>
            
            {/* ============================================================== */}
            {/* KHU VỰC 1: KHÁCH HÀNG (Ai cũng vào được, Dùng CustomerLayout)  */}
            {/* ============================================================== */}
            <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductList />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="profile" element={<Profile />} />
                <Route path="address" element={<AddressManagement />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders" element={<Orders />} />
            </Route>


            {/* ============================================================== */}
            {/* KHU VỰC 2: QUẢN TRỊ VIÊN (Bị khóa bởi AdminRoute)              */}
            {/* ============================================================== */}
            <Route element={<AdminRoute />}>
                {/* Chỉ khi vượt qua AdminRoute, mới được render AdminLayout */}
                <Route path="/admin" element={<AdminLayout />}>                                 
                    <Route index element={<Navigate to="dashboard" replace />} />                           
                    <Route path="dashboard" element={<AdminDashboard />} />                   
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="promotions" element={<PromotionManagement />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="sliders" element={<SliderManagement />} />
                    <Route path="reviews" element={<ReviewManagement />} />
                </Route>
            </Route>

          </Routes>
        </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;