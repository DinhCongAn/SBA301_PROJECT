USE MiniMartDB;
GO

-- Xóa dữ liệu cũ trong các bảng có khóa ngoại để tránh xung đột và chèn lại
DELETE FROM Product_Reviews;
DELETE FROM Cart_Items;
DELETE FROM Order_Items;
DELETE FROM Transactions;
DELETE FROM Orders;
DELETE FROM Product_Images;
DELETE FROM Products;
DELETE FROM Categories;
DELETE FROM Sliders;
DELETE FROM Addresses;
DELETE FROM Users;
DELETE FROM Promotions;
GO

--------------------------------------------------------------------------------
-- 🧍‍♂️ 1. Bảng Users (20 users)
--------------------------------------------------------------------------------
INSERT INTO Users (username, password, email, phone, full_name, role) VALUES
(N'admin', N'$2a$10$hashed_password_admin_demo', N'admin@minimart.vn', N'0900000001', N'Admin Chính', N'ADMIN'),
(N'user', N'$2a$10$hashed_password_user_demo', N'student@fpt.edu.vn', N'0987654321', N'Nguyễn Văn Sinh Viên', N'CUSTOMER'),
(N'customer_02', N'hashed_password_cus_02', N'customer_02@example.com', N'0910000002', N'Trần Thị Bình', N'CUSTOMER'),
(N'customer_03', N'hashed_password_cus_03', N'customer_03@example.com', N'0910000003', N'Lê Văn Cường', N'CUSTOMER'),
(N'customer_04', N'hashed_password_cus_04', N'customer_04@example.com', N'0910000004', N'Phạm Thị Duyên', N'CUSTOMER'),
(N'customer_05', N'hashed_password_cus_05', N'customer_05@example.com', N'0910000005', N'Hoàng Văn Em', N'CUSTOMER'),
(N'customer_06', N'hashed_password_cus_06', N'customer_06@example.com', N'0910000006', N'Đỗ Thị Giang', N'CUSTOMER'),
(N'customer_07', N'hashed_password_cus_07', N'customer_07@example.com', N'0910000007', N'Bùi Văn Hùng', N'CUSTOMER'),
(N'customer_08', N'hashed_password_cus_08', N'customer_08@example.com', N'0910000008', N'Đặng Thị Kim', N'CUSTOMER'),
(N'customer_09', N'hashed_password_cus_09', N'customer_09@example.com', N'0910000009', N'Nguyễn Đình Lộc', N'CUSTOMER'),
(N'customer_10', N'hashed_password_cus_10', N'customer_10@example.com', N'0910000010', N'Trịnh Văn Nam', N'CUSTOMER'),
(N'customer_11', N'hashed_password_cus_11', N'customer_11@example.com', N'0910000011', N'Vũ Thị Oanh', N'CUSTOMER'),
(N'customer_12', N'hashed_password_cus_12', N'customer_12@example.com', N'0910000012', N'Tô Văn Phát', N'CUSTOMER'),
(N'customer_13', N'hashed_password_cus_13', N'customer_13@example.com', N'0910000013', N'Dương Thị Quyên', N'CUSTOMER'),
(N'customer_14', N'hashed_password_cus_14', N'customer_14@example.com', N'0910000014', N'Chu Văn Rạng', N'CUSTOMER'),
(N'customer_15', N'hashed_password_cus_15', N'customer_15@example.com', N'0910000015', N'Triệu Thị San', N'CUSTOMER'),
(N'customer_16', N'hashed_password_cus_16', N'customer_16@example.com', N'0910000016', N'Đinh Văn Tám', N'CUSTOMER'),
(N'customer_17', N'hashed_password_cus_17', N'customer_17@example.com', N'0910000017', N'Cao Thị Uyên', N'CUSTOMER'),
(N'customer_18', N'hashed_password_cus_18', N'customer_18@example.com', N'0910000018', N'Quách Văn Vinh', N'CUSTOMER'),
(N'customer_19', N'hashed_password_cus_19', N'customer_19@example.com', N'0910000019', N'Huỳnh Thị Xuyến', N'CUSTOMER');
GO

--------------------------------------------------------------------------------
-- 🏠 2. Bảng Addresses (20 addresses)
--------------------------------------------------------------------------------
INSERT INTO Addresses (user_id, street, city, province, zip_code, is_default) VALUES
((SELECT user_id FROM Users WHERE username = N'user'), N'Ký túc xá Đại học FPT, Khu Công Nghệ Cao Hòa Lạc', N'Hà Nội', N'Hà Nội', N'10000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_02'), N'45 Trần Hưng Đạo', N'TP. Hồ Chí Minh', N'TP. Hồ Chí Minh', N'70000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_03'), N'67 Lê Lợi', N'Đà Nẵng', N'Đà Nẵng', N'50000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_04'), N'89 Hùng Vương', N'Cần Thơ', N'Cần Thơ', N'90000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_05'), N'10 Phan Bội Châu', N'Hải Phòng', N'Hải Phòng', N'04000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_06'), N'11 Nguyễn Chí Thanh', N'Hà Nội', N'Hà Nội', N'10000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_07'), N'12 Lê Duẩn', N'TP. Hồ Chí Minh', N'TP. Hồ Chí Minh', N'70000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_08'), N'13 Trần Phú', N'Nha Trang', N'Khánh Hòa', N'65000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_09'), N'14 Điện Biên Phủ', N'Huế', N'Thừa Thiên Huế', N'53000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_10'), N'15 Bà Triệu', N'Hà Nội', N'Hà Nội', N'10000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_11'), N'16 Cách Mạng Tháng Tám', N'TP. Hồ Chí Minh', N'TP. Hồ Chí Minh', N'70000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_12'), N'17 Mai Hắc Đế', N'Đà Nẵng', N'Đà Nẵng', N'50000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_13'), N'18 Cao Bá Quát', N'Cần Thơ', N'Cần Thơ', N'90000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_14'), N'19 Ngô Gia Tự', N'Hải Phòng', N'Hải Phòng', N'04000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_15'), N'20 Trương Định', N'Hà Nội', N'Hà Nội', N'10000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_16'), N'21 Vọng Thị', N'TP. Hồ Chí Minh', N'TP. Hồ Chí Minh', N'70000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_17'), N'22 Hoàng Diệu', N'Nha Trang', N'Khánh Hòa', N'65000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_18'), N'23 Phan Chu Trinh', N'Huế', N'Thừa Thiên Huế', N'53000', 1),
((SELECT user_id FROM Users WHERE username = N'customer_19'), N'24 Nguyễn Trãi', N'Hà Nội', N'Hà Nội', N'10000', 1),
((SELECT user_id FROM Users WHERE username = N'user'), N'Số 1, Đường X, Phường Y, Cầu Giấy', N'Hà Nội', N'Hà Nội', N'10000', 0);
GO

--------------------------------------------------------------------------------
-- 🏷️ 3. Bảng Categories (6 Categories chuẩn MiniMart)
--------------------------------------------------------------------------------
INSERT INTO Categories (name, description, image_url) VALUES
(N'Trái cây tươi', N'Hoa quả tươi nhập khẩu và nội địa, nguồn gốc rõ ràng.', N'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600'),
(N'Rau củ quả', N'Rau củ sạch đạt chuẩn VietGAP, tươi ngon mỗi ngày.', N'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600'),
(N'Thịt cá', N'Thịt heo, bò, gà và hải sản tươi sống đông lạnh.', N'https://laodongthudo.vn/stores/news_dataimages/thanhtrung/112017/28/09/lam-the-nao-de-biet-duoc-thit-ca-da-bi-hong-23-.7893.jpg'),
(N'Sữa & Trứng', N'Sữa tươi, sữa chua, phô mai và trứng gia cầm sạch.', N'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600'),
(N'Đồ uống', N'Nước tinh khiết, nước ngọt, bia và các loại thức uống khác.', N'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600'),
(N'Gia vị', N'Mắm, muối, đường, bột ngọt và các loại sốt nấu ăn.', N'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600');
GO

--------------------------------------------------------------------------------
-- 📱 4. Bảng Products (24 sản phẩm - 4 sp/category)
--------------------------------------------------------------------------------

-- Category 1: Trái cây tươi
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Trái cây tươi'), N'Chuối Cavendish Nam Mỹ (Nải)', N'Chuối chín tự nhiên, giàu kali và vitamin. Đảm bảo an toàn vệ sinh thực phẩm.', 45000, 50, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRByW9VkXr_DQPg6o85G95P_odbAtsJ4rwySg&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Trái cây tươi'), N'Táo nhập khẩu Mỹ (1kg)', N'Táo giòn, ngọt lịm, vỏ mỏng, giàu vitamin C.', 120000, 100, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7qsAFkA4h1KBDuAAlnAuTpY8GnEFFEoB76w&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Trái cây tươi'), N'Dưa hấu không hạt (1 trái)', N'Dưa hấu ruột đỏ tươi, mọng nước, giải khát tuyệt vời.', 65000, 30, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRaPVLX2Wi8kDjAq57yoURmveC1aaNLY5u2w&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Trái cây tươi'), N'Sầu riêng Ri6 (Kg)', N'Sầu riêng chín cây, cơm vàng hạt lép, thơm lừng.', 150000, 20, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE75Xk66mOdyFfLGlll2vzaaQa0gPUFAOjOQ&s', N'active');

-- Category 2: Rau củ quả
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Rau củ quả'), N'Cà chua Cherry Đà Lạt (Hộp 500g)', N'Cà chua bi tươi ngon, thích hợp làm salad. Thu hoạch trực tiếp từ nông trại Đà Lạt.', 35000, 120, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoXEIXlgT1cfNwwbQpszYZ2Kerc9-To_e6Ow&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Rau củ quả'), N'Rau muống VietGAP (Bó)', N'Rau muống xanh non, an toàn không thuốc trừ sâu.', 15000, 200, N'https://storage.googleapis.com/sc_pcm_product/prod/2024/7/26/476191-8938525767042.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Rau củ quả'), N'Khoai tây Đà Lạt (1kg)', N'Khoai tây ruột vàng, củ to đều, thích hợp chiên hoặc nấu canh.', 30000, 150, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqxtArJByggwaujIeWzbjbQuns6F3jOI3QZg&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Rau củ quả'), N'Cà rốt tươi (1kg)', N'Cà rốt tươi rói, nhiều nước, ngọt tự nhiên.', 25000, 100, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSduWIrIm_b1f5m9jCw8CKlu9dioHQphuf-6A&s', N'active');

-- Category 3: Thịt cá
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Thịt cá'), N'Thịt Bò Mỹ Nhập Khẩu (500g)', N'Thịt bò mềm, vân mỡ đều, tiêu chuẩn USDA. Cực kỳ ngon khi nướng hoặc làm bít tết.', 250000, 40, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSydS1O0c0jhidAZpygvEUor5H0WsHuTQRNHA&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Thịt cá'), N'Cá hồi Na Uy phi lê (250g)', N'Cá hồi tươi nhập khẩu bằng đường hàng không. Giàu Omega 3.', 180000, 25, N'https://product.hstatic.net/1000301274/product/_10100002__ca_hoi_tuoi_nhap_khau_fillet-6_5abdba3a2be646a29306dc27264adea0.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Thịt cá'), N'Thịt ba rọi heo (500g)', N'Thịt ba chỉ heo sạch, tỉ lệ nạc mỡ hoàn hảo.', 85000, 80, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUp_T_Wq0aY3vncvoR5PdSjZqEDFL3ZngBw&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Thịt cá'), N'Gà ta thả vườn (Nguyên con ~1.5kg)', N'Gà ta thịt chắc, da giòn, dai ngon.', 190000, 30, N'https://cdn.giaoducthoidai.vn/images/b4508baace0d9fe4c8bbd296e259642ef5dbe3681230d084c969cf7840e65716a973695246c89c42ec3ec98b29d618db9f32cff4fc2ca36202679bd6192d6869/meochongangon1601_RJUH.jpg', N'active');

-- Category 4: Sữa & Trứng
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Sữa & Trứng'), N'Sữa tươi TH True Milk 1L', N'Sữa tươi tiệt trùng nguyên chất 100%. Bổ sung canxi và vitamin tự nhiên.', 36000, 200, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjJfRz1fzbOoRhT--KBOAJketrUV8uFEqsng&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Sữa & Trứng'), N'Trứng gà tươi Ba Huân (Hộp 10 quả)', N'Trứng gà công nghiệp, lòng đỏ to, đã qua xử lý ozone.', 32000, 150, N'https://product.hstatic.net/1000141988/product/trung_ga_tuoi_premium_55_g__10_trunghop___c80402fbaf0e4641945fe68a1c7b1983_master.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Sữa & Trứng'), N'Sữa chua Vinamilk có đường (Vỉ 4 hộp)', N'Lên men tự nhiên, tốt cho hệ tiêu hóa.', 25000, 100, N'https://product.hstatic.net/200000559893/product/sua-chua-khong-duong-vinamilk-pcv_f4b9075ebb684c6184897e85f8dd5959.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Sữa & Trứng'), N'Phô mai Con Bò Cười (Hộp 8 miếng)', N'Bổ sung Canxi và kẽm, hương vị béo ngậy.', 45000, 80, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyA6f9do-HzO3YGSFG8kpiygrOseXhVMLOIA&s', N'active');

-- Category 5: Đồ uống
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Đồ uống'), N'Nước tinh khiết Aquafina (Chai 500ml)', N'Nước tinh khiết đóng chai tiện lợi.', 5000, 500, N'https://cdn.tgdd.vn//News/1478714//top-10-loai-nuoc-tinh-khiet-tot-nhat-hien-nay-18-845x450.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Đồ uống'), N'Bia Tiger Thùng 24 Lon (330ml)', N'Bia Tiger mát lạnh, sảng khoái.', 380000, 40, N'https://product.hstatic.net/200000078749/product/tiger_bac_4c1d8d23263e42589d46f33db992cb40_c589407823c346b890a9f72bddf5443a_grande.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Đồ uống'), N'Nước ngọt Coca-Cola (Chai 1.5L)', N'Giải khát tột đỉnh cùng Coca-Cola.', 22000, 120, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSlp8xbuRE5gvtCNCbyLl1oL_IUMeQ1UNlIA&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Đồ uống'), N'Nước ép cam Tropicana (Hộp 1L)', N'100% nước cam nguyên chất, giàu vitamin C.', 55000, 60, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCpo28NN0AKxO1B6ZOtDUFyrot3BjoAEqPag&s', N'active');

-- Category 6: Gia vị
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Gia vị'), N'Nước mắm Nam Ngư (Chai 500ml)', N'Nước mắm nhĩ thơm ngon, đậm đà hương vị Việt.', 42000, 150, N'https://cdn.tgdd.vn/Products/Images/2289/79053/bhx/nuoc-mam-nam-ngu-12-do-dam-chai-900ml-202304131744430602.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Gia vị'), N'Dầu ăn Neptune (Chai 1L)', N'Dầu ăn thượng hạng, tốt cho tim mạch.', 60000, 100, N'https://brgshopping.vn/web/image/product.template/2589/image?unique=d6a6b11', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Gia vị'), N'Đường tinh luyện Biên Hòa (Gói 1kg)', N'Đường trắng tinh khiết, hạt mịn.', 28000, 200, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_gs9wDae_GAmbOoyA14uTK5vHgvyd6JGt8Q&s', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Gia vị'), N'Bột nêm Knorr thịt thăn (Gói 400g)', N'Đậm vị thịt xương hầm, cho món ăn thêm ngon.', 38000, 120, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8jjqOqXv8cabqiqaA9U942CoHu9H2qs_V-Q&s', N'active');
GO


--------------------------------------------------------------------------------
-- 🖼️ 5. Bảng Product_Images (Tùy chọn, để trống cũng không sao vì đã có thumbnail)
--------------------------------------------------------------------------------
-- Có thể bỏ qua bước insert bảng này nếu giao diện frontend của bạn 
-- hiện tại chỉ dùng trường thumbnail_url của bảng Products.


--------------------------------------------------------------------------------
-- 🌟 6. Bảng Product_Reviews (Đánh giá giả lập)
--------------------------------------------------------------------------------
INSERT INTO Product_Reviews (product_id, user_id, rating, comment) VALUES
((SELECT product_id FROM Products WHERE name = N'Chuối Cavendish Nam Mỹ (Nải)'), (SELECT user_id FROM Users WHERE username = N'customer_02'), 5, N'Chuối rất ngon, tươi và không bị dập.'),
((SELECT product_id FROM Products WHERE name = N'Thịt Bò Mỹ Nhập Khẩu (500g)'), (SELECT user_id FROM Users WHERE username = N'customer_03'), 4, N'Thịt mềm, đóng gói cẩn thận, làm bít tết tuyệt vời.'),
((SELECT product_id FROM Products WHERE name = N'Sữa tươi TH True Milk 1L'), (SELECT user_id FROM Users WHERE username = N'customer_04'), 5, N'Giao hàng nhanh, sữa date mới.');
GO

--------------------------------------------------------------------------------
-- 🎁 7. Bảng Promotions (Mã giảm giá cho MiniMart)
--------------------------------------------------------------------------------
INSERT INTO Promotions (code, discount_type, discount_value, min_order_amount, start_date, end_date, usage_limit, used_count, is_active) VALUES
(N'FREESHIP', N'FIXED_AMOUNT', 30000.00, 200000.00, '2024-01-01', '2026-12-31', NULL, 150, 1),
(N'SALE10', N'PERCENTAGE', 10.00, 500000.00, '2026-03-01', '2026-04-30', 100, 10, 1),
(N'NEWUSER', N'FIXED_AMOUNT', 50000.00, 150000.00, '2024-01-01', '2026-12-31', 500, 25, 1);
GO

--------------------------------------------------------------------------------
-- 🖼️ 8. Bảng Sliders (Banner trang chủ)
--------------------------------------------------------------------------------
INSERT INTO Sliders (image_url, link_url, title, description, status, order_number) VALUES
(N'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', N'/products', N'Siêu thị thông minh', N'Thực phẩm tươi sạch mỗi ngày', N'active', 1),
(N'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&q=80', N'/products?category=1', N'Lễ hội trái cây', N'Trái cây nhập khẩu giảm giá 20%', N'active', 2);
GO

PRINT N'✅ Dữ liệu mẫu SIÊU THỊ MINIMART đã được chèn thành công!';