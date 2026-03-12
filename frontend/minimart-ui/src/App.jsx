import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn cha sử dụng CustomerLayout */}
        <Route path="/" element={<CustomerLayout />}>
            
            {/* Các trang con tự động nhảy vào thẻ <Outlet /> */}
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            {/* Sau này thêm trang vào đây: <Route path="cart" element={<Cart />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;