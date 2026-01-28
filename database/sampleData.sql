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

-- Chèn dữ liệu mẫu cho bảng Users (20 users)
INSERT INTO Users (username, password, email, phone, full_name, role) VALUES
(N'admin_main', N'hashed_password_admin_01', N'admin_main@example.com', N'0900000001', N'Admin Chính', N'ADMIN'),
(N'customer_01', N'hashed_password_cus_01', N'customer_01@example.com', N'0910000001', N'Nguyễn Văn An', N'CUSTOMER'),
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

-- Chèn dữ liệu mẫu cho bảng Addresses (20 addresses)
INSERT INTO Addresses (user_id, street, city, province, zip_code, is_default) VALUES
((SELECT user_id FROM Users WHERE username = N'customer_01'), N'123 Nguyễn Du', N'Hà Nội', N'Hà Nội', N'10000', 1),
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
((SELECT user_id FROM Users WHERE username = N'customer_01'), N'25 Láng Hạ', N'Hà Nội', N'Hà Nội', N'10000', 0); -- Thêm địa chỉ phụ cho user 01
GO

-- Chèn dữ liệu mẫu mới cho bảng Categories (8 categories)
INSERT INTO Categories (name, description, image_url) VALUES
(N'Điện thoại Samsung', N'Các dòng điện thoại thông minh và phổ thông từ Samsung.', N'https://cdn.tgdd.vn/Products/Images/42/328750/samsung-galaxy-a06-blue-thumbn-600x600.jpg'),
(N'Điện thoại Apple', N'Các mẫu iPhone và thiết bị liên quan từ Apple.', N'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png'),
(N'Điện thoại Xiaomi', N'Điện thoại Xiaomi với hiệu năng mạnh mẽ và giá cả phải chăng.', N'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi_14t_2_.png'),
(N'Điện thoại OPPO', N'Điện thoại OPPO với camera chụp ảnh đẹp và thiết kế thời trang.', N'https://cdn2.cellphones.com.vn/x/media/catalog/product/o/p/oppo-a5i-4gb-128gb-do-tim_2.jpg'),
(N'Điện thoại Vivo', N'Điện thoại Vivo với công nghệ camera tiên tiến và trải nghiệm mượt mà.', N'https://www.duchuymobile.com/images/detailed/59/vivo-S17e-duchuymobile.jpg'),
(N'Điện thoại Realme', N'Điện thoại Realme với cấu hình mạnh mẽ và thiết kế độc đáo.', N'https://cdn.viettelstore.vn/Images/Product/ProductImage/556955088.jpeg'),
(N'Điện thoại Nokia', N'Điện thoại Nokia bền bỉ, đáng tin cậy.', N'https://cdn.tgdd.vn/Products/Images/42/311033/nokia-105-4g-xanh-thumbnail-600x600.jpg');
GO

-- Chèn dữ liệu mẫu mới cho bảng Products (tương ứng 5 sản phẩm/category = 40 dòng)

-- Category: Điện thoại Samsung
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Samsung'), N'Samsung Galaxy S24 Ultra', N'Điện thoại cao cấp với S Pen tích hợp, camera 200MP.', 1199.99, 50, N'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-s928-sm-s928bzkqxxv-539307400?$684_547_PNG$', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Samsung'), N'Samsung Galaxy S24+', N'Màn hình lớn, hiệu năng mạnh mẽ.', 999.00, 60, N'https://alltech.pk/wp-content/uploads/2024/04/3.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Samsung'), N'Samsung Galaxy A55 5G', N'Thiết kế bền bỉ, camera sắc nét, pin trâu.', 429.00, 75, N'https://taozinsaigon.com/files_upload/product/03_2024/thumbs/600_ava_a55_blue.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Samsung'), N'Samsung Galaxy Z Flip5', N'Thiết kế gập độc đáo, màn hình phụ lớn.', 899.00, 30, N'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-a55_4__1_2_1_1.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Samsung'), N'Samsung Galaxy M15 5G', N'Pin khủng 6000mAh, hiệu năng ổn định.', 199.00, 100, N'https://cdn.tgdd.vn/Products/Images/42/320964/samsung-galaxy-m15-5g-blue-thumb-600x600.jpg', N'active');

-- Category: Điện thoại Apple
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Apple'), N'iPhone 15 Pro Max', N'Chip A17 Pro, hệ thống camera tiên tiến nhất.', 1250.00, 45, N'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5_2_1_1.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Apple'), N'iPhone 15', N'Dynamic Island, camera 48MP, USB-C.', 799.00, 70, N'https://product.hstatic.net/1000379731/product/15prmvn_ff93080be05b454d8e3f37b7771d9cb1.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Apple'), N'iPhone SE (2022)', N'Chip A15 Bionic, 5G, thiết kế nhỏ gọn.', 429.00, 65, N'https://hanoicomputercdn.com/media/product/76341_natural_titanium_update__2_.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Apple'), N'iPad Air 11-inch (M2)', N'Chip M2 mạnh mẽ, màn hình Liquid Retina.', 599.00, 40, N'https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2023/11/iPhone-15-Pro-Max-mau-titan-xanh.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Apple'), N'Apple Watch Series 9', N'Đồng hồ thông minh với các tính năng sức khỏe tiên tiến.', 399.00, 55, N'https://product.hstatic.net/1000259254/product/iphone_15_pro_2023_-_trang_5ac5b2d1decb4f288707bb854f568c88.jpg', N'active');

-- Category: Điện thoại Xiaomi
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Xiaomi'), N'Xiaomi 14 Ultra', N'Hệ thống camera Leica, hiệu năng đỉnh cao.', 880.00, 30, N'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-xiaomi-redmi-note-14_2__2.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Xiaomi'), N'Redmi Note 13 Pro 5G', N'Màn hình AMOLED 120Hz, camera 200MP.', 349.00, 80, N'https://www.vayava.com/5828-large_default/xiaomi-redmi-note-14-4g-version-internacional.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Xiaomi'), N'Xiaomi 14', N'Thiết kế nhỏ gọn, hiệu năng flagship.', 750.00, 35, N'https://avinari.cl/cdn/shop/files/Amazon-Photoroom-2025-01-16T180652.148_5d7da117-d9f6-4d49-a517-c2a512bd7043_800x.jpg?v=1737143063', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Xiaomi'), N'Poco X6 Pro', N'Hiệu năng gaming mạnh mẽ trong tầm giá.', 399.00, 60, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh4L6sQjSsJ9g86fiYTTpa2vaBdwpnvZnptZ8O_Rtw5YiymNUdECYczIqeG9oLq8vbvgM&usqp=CAU', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Xiaomi'), N'Redmi 13C', N'Điện thoại phổ thông pin lớn, giá rẻ.', 129.00, 120, N'https://bizweb.dktcdn.net/100/463/685/products/13a.png?v=1696229633323', N'active');

-- Category: Điện thoại OPPO
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Điện thoại OPPO'), N'OPPO Find X7 Ultra', N'Thiết kế độc đáo, camera Hasselblad cao cấp.', 980.00, 25, N'https://cdn.xtmobile.vn/vnt_upload/product/05_2024/thumbs/(600x600)_crop_oppo-reno-13-pro-5g-xtmobile.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại OPPO'), N'OPPO Reno11 F 5G', N'Sạc nhanh SuperVOOC, thiết kế mỏng nhẹ.', 389.00, 70, N'https://cdn.mobilecity.vn/mobilecity-vn/images/2025/03/w250/oppo-a5-enregy-hong.jpg.webp', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại OPPO'), N'OPPO A60', N'Pin trâu, hiệu năng ổn định cho nhu cầu cơ bản.', 199.00, 90, N'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-oppo-reno12-5g_5__5.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại OPPO'), N'OPPO Find N3 Flip', N'Điện thoại gập thời trang, camera chụp ảnh đẹp.', 850.00, 20, N'https://genk.mediacdn.vn/139269124445442048/2024/10/15/oppo-find-x8-white-17289752079171549495364-1728975582352-17289755824771858325498-1728980257634-172898025784472891135.jpeg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại OPPO'), N'OPPO A38', N'Giá rẻ, pin bền, đủ dùng cho học sinh.', 149.00, 110, N'https://bizweb.dktcdn.net/100/506/962/products/dien-thoai-oppo-find-x8-4-1-2-b6c4f5b7-af9e-451a-b136-7f1129896728.webp?v=1743442691157', N'active');

-- Category: Điện thoại Vivo
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Vivo'), N'Vivo X100 Pro', N'Camera Zeiss, hiệu năng mạnh mẽ.', 950.00, 28, N'https://www.duchuymobile.com/images/detailed/59/vivo-S17e-duchuymobile.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Vivo'), N'Vivo V30e 5G', N'Thiết kế mỏng nhẹ, pin lớn, camera chân dung.', 399.00, 65, N'https://cdn.nguyenkimmall.com/images/thumbnails/382/382/detailed/766/10050700-dien-thoai-vivo-v23e-8gb-128gb-den-1.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Vivo'), N'Vivo Y28 5G', N'Pin 6000mAh, sạc nhanh 44W, kháng nước.', 229.00, 80, N'https://www.duchuymobile.com/images/detailed/59/vivo-S17e-duchuymobile.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Vivo'), N'Vivo Y03', N'Điện thoại cơ bản, giá siêu rẻ.', 99.00, 150, N'https://cdn.nguyenkimmall.com/images/thumbnails/382/382/detailed/766/10050700-dien-thoai-vivo-v23e-8gb-128gb-den-1.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Vivo'), N'Vivo X Fold3 Pro', N'Điện thoại gập siêu mỏng, hiệu năng cao.', 1500.00, 15, N'https://www.duchuymobile.com/images/detailed/59/vivo-S17e-duchuymobile.jpg', N'active');

-- Category: Điện thoại Realme
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Realme'), N'Realme 12 Pro+', N'Camera zoom tiềm vọng, thiết kế cao cấp.', 379.00, 55, N'https://cdn.viettelstore.vn/Images/Product/ProductImage/556955088.jpeg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Realme'), N'Realme C65', N'Pin lớn, sạc nhanh, thiết kế bền bỉ.', 189.00, 100, N'https://vienthinh.vn/assets/Uploads/sanpham/3198/realme-c60-blue-1-1.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Realme'), N'Realme GT Neo 6 SE', N'Hiệu năng mạnh mẽ cho gaming, màn hình sáng.', 450.00, 40, N'https://bizweb.dktcdn.net/thumb/grande/100/215/078/products/z5296172639622-7e5b63e1df449b2179f4c082827da912.jpg?v=1711699030320', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Realme'), N'Realme Note 50', N'Thiết kế mỏng, pin bền, giá cực tốt.', 99.00, 180, N'https://cdn.viettelstore.vn/Images/Product/ProductImage/1680635187.jpeg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Realme'), N'Realme P1 Pro 5G', N'Màn hình cong AMOLED, hiệu năng mượt mà.', 299.00, 70, N'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-realme-c60_1__1.png', N'active');

-- Category: Điện thoại Nokia
INSERT INTO Products (category_id, name, description, price, stock_quantity, thumbnail_url, status) VALUES
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Nokia'), N'Nokia C32', N'Pin lớn, thiết kế bền bỉ, Android Go.', 149.00, 90, N'https://vienthinh.vn/assets/Uploads/sanpham/2877/nokia-24-015520a-025554-400x460.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Nokia'), N'Nokia G400 5G', N'Điện thoại tầm trung 5G, màn hình 120Hz.', 249.00, 60, N'https://img.websosanh.vn/v2/users/dclimg/images/7dcqg9nr8290n.jpg?compress=85', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Nokia'), N'Nokia 105', N'Điện thoại phổ thông huyền thoại, pin siêu trâu.', 25.00, 200, N'https://vienthinh.vn/assets/Uploads/sanpham/2877/nokia-24-015520a-025554-400x460.png', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Nokia'), N'Nokia C21 Plus', N'Giá rẻ, thiết kế chắc chắn, pin cả ngày.', 99.00, 150, N'https://cdn.tgdd.vn/Products/Images/42/240190/nokia-c01-plus-600x600.jpg', N'active'),
((SELECT category_id FROM Categories WHERE name = N'Điện thoại Nokia'), N'Nokia XR21', N'Điện thoại siêu bền, chống nước, chống va đập.', 499.00, 25, N'https://cdn.chiaki.vn/unsafe/0x960/left/top/smart/filters:quality(75)/https://chiaki.vn/upload/product/2022/08/dien-thoai-nokia-c20-2gb-16gb-chinh-hang-62f21b25c4398-09082022153029.jpg', N'active');
GO

-- Chèn dữ liệu mẫu mới cho bảng Product_Images (mỗi sản phẩm 3 ảnh, tổng 120 dòng)

-- Category: Điện thoại Samsung
INSERT INTO Product_Images (product_id, image_url, sort_order) VALUES
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24 Ultra'), N'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT3J47ToPhmYq5q9BdSXYCMl0Y6VdXl5fLFtqkqU2PfbqEMmyWK7hdn7FJo6OARglUYlGRsc1rX4LIefwGuuw091GsYmfsJgRIIb_q73pP0l2GHkWAADuTUpmv_f95Qhu-C0l81m5I&usqp=CAc', 0),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24 Ultra'), N'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQsJDgxHG1Cz9_Loww1NGKfoYJ3WOkijdLdkQVz94lzUftQ1AoKOaFng4qGW1SdCy-jmNrZRBzdJHoZ_5fBn4IfwF6x3ovVGQMJJsGH1AqgMqOrQDp1HHrgAO3rZD78giOsR3Vc_fU&usqp=CAc', 1),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24 Ultra'), N'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTsVvmVjmskr3JIoEeqBaidWYK7EI8v49SUBfr5jRmGEjhcWh0bLNcUwd03TEXGUhIxxQm8GlYQ_9gNODiRdQrI-MD2hwPPV6n6bb9y8-amxOxxwXAyGFTE5s8NteavrImKZyLJnw&usqp=CAc', 2),

((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24+'), N'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQsJDgxHG1Cz9_Loww1NGKfoYJ3WOkijdLdkQVz94lzUftQ1AoKOaFng4qGW1SdCy-jmNrZRBzdJHoZ_5fBn4IfwF6x3ovVGQMJJsGH1AqgMqOrQDp1HHrgAO3rZD78giOsR3Vc_fU&usqp=CAc', 0),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24+'), N'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ_Q-ykYTKENHQJUDUVV2RAziAlCrQRgMUOlxpneLUbyJJSO1TyTlMyXQUe0ikqPvLzj63sBJ_MCzHpfZUYYDKYgxSN0i4f9l3Ay_g53YX8RDtZ-v_4_aZ2L1zEcMOdZ_854hgkOWU&usqp=CAc', 1),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24+'), N'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT3J47ToPhmYq5q9BdSXYCMl0Y6VdXl5fLFtqkqU2PfbqEMmyWK7hdn7FJo6OARglUYlGRsc1rX4LIefwGuuw091GsYmfsJgRIIb_q73pP0l2GHkWAADuTUpmv_f95Qhu-C0l81m5I&usqp=CAc', 2),

((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy A55 5G'), N'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQd1SmdEXvaT28i1WvHm3wLTHpWLNDL2KdD985QSTfUr4adalkJ_tSFJxyHjf6TnNTC5-QAXkJxFNE-FmZDbmT099a3PaXQ0k2vTAyEihYvSix8Ba2b0mwjqIxLLoWSgoay-37qbKo&usqp=CAc', 0),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy A55 5G'), N'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRmPSSj4I-xTQGMvAii-2JsXUJ6dszh8O4J38it3c6W6n0E3kWAMBleZl8-mZ4pGT9EFaAu7Xl2tMbq3Vpa0rUrrhQZcYgvUUbi1gw_c8dhZCYf7G7HS1tW5NmiEVzYtmkddkt8-S4&usqp=CAc', 1),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy A55 5G'), N'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSzQUkCdcwUf3ubhPNCXDD8N7jFRrz4IrJ7OESPz-18O2BSHY9hDTrWtMHOeCREbV9dc6sNCwaW24YPvuLnskudmEAPvhB_yFy-afmsA1aJ--RQ_CGJjgA7LveRGfQ9vyWUZkMcNLQ&usqp=CAc', 2),

((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy Z Flip5'), N'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQEHB15zXuHqhWIoPuMxeKqf_oFUCn6DKAlYzooc6GpsUtSjZa6wKupTDwIpfd40tBMiifzuEFf64251XnArDzpoVrivt8EjtNhdTTnBbPOuALkbFA9CAaB0hHBBK2MGTOKvr_V_JI&usqp=CAc', 0),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy Z Flip5'), N'https://bachlongstore.vn/vnt_upload/product/09_2023/purples.png', 1),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy Z Flip5'), N'https://demobile.vn/wp-content/uploads/2023/08/samsung-z-flip-5-5g-new-seal-100-chinh-hang-viet-nam-4.jpg', 2),

((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy M15 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/03/samsung-galaxy-m15-5g-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy M15 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/03/samsung-galaxy-m15-5g-blue-black.png', 1),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy M15 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/03/samsung-galaxy-m15-5g-light-blue.png', 2);

-- Category: Điện thoại Apple
INSERT INTO Product_Images (product_id, image_url, sort_order) VALUES
((SELECT product_id FROM Products WHERE name = N'iPhone 15 Pro Max'), N'https://huythanhluxury.vn/watermark/product/750x750x1/upload/product/14-pm-titan-logo-8568.jpg', 0),
((SELECT product_id FROM Products WHERE name = N'iPhone 15 Pro Max'), N'https://cdn.viettablet.com/images/detailed/59/apple-iphone-15-pro-max-MY-viettablet_s81l-7f.jpg', 1),
((SELECT product_id FROM Products WHERE name = N'iPhone 15 Pro Max'), N'https://taovietdongxoai.com/wp-content/uploads/2024/11/12promax-white-min-247x247.jpg.webp', 2),

((SELECT product_id FROM Products WHERE name = N'iPhone 15'), N'https://cdn.tgdd.vn/Products/Images/42/281570/iphone-15-xanh-thumb-600x600.jpg', 0),
((SELECT product_id FROM Products WHERE name = N'iPhone 15'), N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmxHYwv5EbcatRQg1Y49hw-UF0skZs5Si3qGTd_1Nn2FXLxEzATwmXbpWLoyncjcAQXq4&usqp=CAU', 1),
((SELECT product_id FROM Products WHERE name = N'iPhone 15'), N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYoo-tbcZxSEPlPTlUx4tfx4LXT7PNzn2p1bzgDNCS4mopgk3DhbIsbFXKJO8Ig9ZLDQE&usqp=CAU', 2),

((SELECT product_id FROM Products WHERE name = N'iPhone SE (2022)'), N'https://www.didongmy.com/vnt_upload/product/04_2020/thumbs/(600x600)_iphone_se_2020_do.png', 0),
((SELECT product_id FROM Products WHERE name = N'iPhone SE (2022)'), N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNJ5b1tLczdmiExYkNv2NlTEDTD1v3uW5y4MgR4ILdAX_9IZnXKPlWf5MlkmDdSIi4-dc&usqp=CAU', 1),
((SELECT product_id FROM Products WHERE name = N'iPhone SE (2022)'), N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgN9CqKuTsXtFHffWjIXnpLI0ctPZa41DEUqkvvX6L3pz5T7ukxFO1m2-LBenNjBYc4M4&usqp=CAU', 2),

((SELECT product_id FROM Products WHERE name = N'iPad Air 11-inch (M2)'), N'https://cdn.hoanghamobile.com/images/products/2024/05/ipad-air-m2-11-inch-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'iPad Air 11-inch (M2)'), N'https://cdn.hoanghamobile.com/images/products/2024/05/ipad-air-m2-11-inch-starlight.png', 1),
((SELECT product_id FROM Products WHERE name = N'iPad Air 11-inch (M2)'), N'https://cdn.hoanghamobile.com/images/products/2024/05/ipad-air-m2-11-inch-space-gray.png', 2),

((SELECT product_id FROM Products WHERE name = N'Apple Watch Series 9'), N'https://cdn.hoanghamobile.com/images/products/2023/09/apple-watch-series-9-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Apple Watch Series 9'), N'https://cdn.hoanghamobile.com/images/products/2023/09/apple-watch-series-9-pink.png', 1),
((SELECT product_id FROM Products WHERE name = N'Apple Watch Series 9'), N'https://cdn.hoanghamobile.com/images/products/2023/09/apple-watch-series-9-red.png', 2);

-- Category: Điện thoại Xiaomi
INSERT INTO Product_Images (product_id, image_url, sort_order) VALUES
((SELECT product_id FROM Products WHERE name = N'Xiaomi 14 Ultra'), N'https://cdn.hoanghamobile.com/images/products/2024/02/thumb-xiaomi-14-ultra.png', 0),
((SELECT product_id FROM Products WHERE name = N'Xiaomi 14 Ultra'), N'https://cdn.hoanghamobile.com/images/products/2024/02/xiaomi-14-ultra-white.png', 1),
((SELECT product_id FROM Products WHERE name = N'Xiaomi 14 Ultra'), N'https://cdn.hoanghamobile.com/images/products/2024/02/xiaomi-14-ultra-blue.png', 2),

((SELECT product_id FROM Products WHERE name = N'Redmi Note 13 Pro 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/01/redmi-note-13-pro-5g-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Redmi Note 13 Pro 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/01/redmi-note-13-pro-5g-green.png', 1),
((SELECT product_id FROM Products WHERE name = N'Redmi Note 13 Pro 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/01/redmi-note-13-pro-5g-purple.png', 2),

((SELECT product_id FROM Products WHERE name = N'Xiaomi 14'), N'https://cdn.hoanghamobile.com/images/products/2024/02/xiaomi-14-black-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Xiaomi 14'), N'https://cdn.hoanghamobile.com/images/products/2024/02/xiaomi-14-white.png', 1),
((SELECT product_id FROM Products WHERE name = N'Xiaomi 14'), N'https://cdn.hoanghamobile.com/images/products/2024/02/xiaomi-14-green.png', 2),

((SELECT product_id FROM Products WHERE name = N'Poco X6 Pro'), N'https://cdn.hoanghamobile.com/images/products/2024/01/poco-x6-pro-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Poco X6 Pro'), N'https://cdn.hoanghamobile.com/images/products/2024/01/poco-x6-pro-yellow.png', 1),
((SELECT product_id FROM Products WHERE name = N'Poco X6 Pro'), N'https://cdn.hoanghamobile.com/images/products/2024/01/poco-x6-pro-grey.png', 2),

((SELECT product_id FROM Products WHERE name = N'Redmi 13C'), N'https://cdn.hoanghamobile.com/images/products/2023/11/redmi-13c-black-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Redmi 13C'), N'https://cdn.hoanghamobile.com/images/products/2023/11/redmi-13c-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'Redmi 13C'), N'https://cdn.hoanghamobile.com/images/products/2023/11/redmi-13c-green.png', 2);

-- Category: Điện thoại OPPO
INSERT INTO Product_Images (product_id, image_url, sort_order) VALUES
((SELECT product_id FROM Products WHERE name = N'OPPO Find X7 Ultra'), N'https://cdn.hoanghamobile.com/images/products/2024/01/oppo-fiNd-x7-ultra-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'OPPO Find X7 Ultra'), N'https://cdn.hoanghamobile.com/images/products/2024/01/oppo-fiNd-x7-ultra-brown.png', 1),
((SELECT product_id FROM Products WHERE name = N'OPPO Find X7 Ultra'), N'https://cdn.hoanghamobile.com/images/products/2024/01/oppo-fiNd-x7-ultra-blue.png', 2),

((SELECT product_id FROM Products WHERE name = N'OPPO Reno11 F 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/02/oppo-reNo11-f-5g-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'OPPO Reno11 F 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/02/oppo-reNo11-f-5g-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'OPPO Reno11 F 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/02/oppo-reNo11-f-5g-pink.png', 2),

((SELECT product_id FROM Products WHERE name = N'OPPO A60'), N'https://cdn.hoanghamobile.com/images/products/2024/05/oppo-a60-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'OPPO A60'), N'https://cdn.hoanghamobile.com/images/products/2024/05/oppo-a60-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'OPPO A60'), N'https://cdn.hoanghamobile.com/images/products/2024/05/oppo-a60-purple.png', 2),

((SELECT product_id FROM Products WHERE name = N'OPPO Find N3 Flip'), N'https://cdn.hoanghamobile.com/images/products/2023/10/oppo-fiNd-N3-flip-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'OPPO Find N3 Flip'), N'https://cdn.hoanghamobile.com/images/products/2023/10/oppo-fiNd-N3-flip-gold.png', 1),
((SELECT product_id FROM Products WHERE name = N'OPPO Find N3 Flip'), N'https://cdn.hoanghamobile.com/images/products/2023/10/oppo-fiNd-N3-flip-black.png', 2),

((SELECT product_id FROM Products WHERE name = N'OPPO A38'), N'https://cdn.hoanghamobile.com/images/products/2023/09/oppo-a38-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'OPPO A38'), N'https://cdn.hoanghamobile.com/images/products/2023/09/oppo-a38-gold.png', 1),
((SELECT product_id FROM Products WHERE name = N'OPPO A38'), N'https://cdn.hoanghamobile.com/images/products/2023/09/oppo-a38-black.png', 2);

-- Category: Điện thoại Vivo
INSERT INTO Product_Images (product_id, image_url, sort_order) VALUES
((SELECT product_id FROM Products WHERE name = N'Vivo X100 Pro'), N'https://cdn.hoanghamobile.com/images/products/2023/12/vivo-x100-pro-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Vivo X100 Pro'), N'https://cdn.hoanghamobile.com/images/products/2023/12/vivo-x100-pro-orange.png', 1),
((SELECT product_id FROM Products WHERE name = N'Vivo X100 Pro'), N'https://cdn.hoanghamobile.com/images/products/2023/12/vivo-x100-pro-blue.png', 2),

((SELECT product_id FROM Products WHERE name = N'Vivo V30e 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/05/vivo-v30e-5g-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Vivo V30e 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/05/vivo-v30e-5g-gold.png', 1),
((SELECT product_id FROM Products WHERE name = N'Vivo V30e 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/05/vivo-v30e-5g-green.png', 2),

((SELECT product_id FROM Products WHERE name = N'Vivo Y28 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/05/vivo-y28-5g-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Vivo Y28 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/05/vivo-y28-5g-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'Vivo Y28 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/05/vivo-y28-5g-green.png', 2),

((SELECT product_id FROM Products WHERE name = N'Vivo Y03'), N'https://cdn.hoanghamobile.com/images/products/2024/03/vivo-y03-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Vivo Y03'), N'https://cdn.hoanghamobile.com/images/products/2024/03/vivo-y03-green.png', 1),
((SELECT product_id FROM Products WHERE name = N'Vivo Y03'), N'https://cdn.hoanghamobile.com/images/products/2024/03/vivo-y03-blue.png', 2),

((SELECT product_id FROM Products WHERE name = N'Vivo X Fold3 Pro'), N'https://cdn.hoanghamobile.com/images/products/2024/03/vivo-x-fold3-pro-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Vivo X Fold3 Pro'), N'https://cdn.hoanghamobile.com/images/products/2024/03/vivo-x-fold3-pro-black.png', 1),
((SELECT product_id FROM Products WHERE name = N'Vivo X Fold3 Pro'), N'https://cdn.hoanghamobile.com/images/products/2024/03/vivo-x-fold3-pro-white.png', 2);

-- Category: Điện thoại Realme
INSERT INTO Product_Images (product_id, image_url, sort_order) VALUES
((SELECT product_id FROM Products WHERE name = N'Realme 12 Pro+'), N'https://cdn.hoanghamobile.com/images/products/2024/01/realme-12-pro-plus-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Realme 12 Pro+'), N'https://cdn.hoanghamobile.com/images/products/2024/01/realme-12-pro-plus-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'Realme 12 Pro+'), N'https://cdn.hoanghamobile.com/images/products/2024/01/realme-12-pro-plus-beige.png', 2),

((SELECT product_id FROM Products WHERE name = N'Realme C65'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-c65-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Realme C65'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-c65-green.png', 1),
((SELECT product_id FROM Products WHERE name = N'Realme C65'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-c65-purple.png', 2),

((SELECT product_id FROM Products WHERE name = N'Realme GT Neo 6 SE'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-gt-Neo-6-se-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Realme GT Neo 6 SE'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-gt-Neo-6-se-green.png', 1),
((SELECT product_id FROM Products WHERE name = N'Realme GT Neo 6 SE'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-gt-Neo-6-se-silver.png', 2),

((SELECT product_id FROM Products WHERE name = N'Realme Note 50'), N'https://cdn.hoanghamobile.com/images/products/2024/02/realme-Note-50-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Realme Note 50'), N'https://cdn.hoanghamobile.com/images/products/2024/02/realme-Note-50-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'Realme Note 50'), N'https://cdn.hoanghamobile.com/images/products/2024/02/realme-Note-50-green.png', 2),

((SELECT product_id FROM Products WHERE name = N'Realme P1 Pro 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-p1-pro-5g-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Realme P1 Pro 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-p1-pro-5g-red.png', 1),
((SELECT product_id FROM Products WHERE name = N'Realme P1 Pro 5G'), N'https://cdn.hoanghamobile.com/images/products/2024/04/realme-p1-pro-5g-blue.png', 2);

-- Category: Điện thoại Nokia
INSERT INTO Product_Images (product_id, image_url, sort_order) VALUES
((SELECT product_id FROM Products WHERE name = N'Nokia C32'), N'https://cdn.hoanghamobile.com/images/products/2023/02/Nokia-c32-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Nokia C32'), N'https://cdn.hoanghamobile.com/images/products/2023/02/Nokia-c32-pink.png', 1),
((SELECT product_id FROM Products WHERE name = N'Nokia C32'), N'https://cdn.hoanghamobile.com/images/products/2023/02/Nokia-c32-green.png', 2),

((SELECT product_id FROM Products WHERE name = N'Nokia G400 5G'), N'https://cdn.hoanghamobile.com/images/products/2022/01/Nokia-g400-5g-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Nokia G400 5G'), N'https://cdn.hoanghamobile.com/images/products/2022/01/Nokia-g400-5g-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'Nokia G400 5G'), N'https://cdn.hoanghamobile.com/images/products/2022/01/Nokia-g400-5g-black.png', 2),

((SELECT product_id FROM Products WHERE name = N'Nokia 105'), N'https://cdn.hoanghamobile.com/images/products/2023/09/Nokia-105-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Nokia 105'), N'https://cdn.hoanghamobile.com/images/products/2023/09/Nokia-105-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'Nokia 105'), N'https://cdn.hoanghamobile.com/images/products/2023/09/Nokia-105-red.png', 2),

((SELECT product_id FROM Products WHERE name = N'Nokia C21 Plus'), N'https://cdn.hoanghamobile.com/images/products/2022/03/Nokia-c21-plus-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Nokia C21 Plus'), N'https://cdn.hoanghamobile.com/images/products/2022/03/Nokia-c21-plus-blue.png', 1),
((SELECT product_id FROM Products WHERE name = N'Nokia C21 Plus'), N'https://cdn.hoanghamobile.com/images/products/2022/03/Nokia-c21-plus-grey.png', 2),

((SELECT product_id FROM Products WHERE name = N'Nokia XR21'), N'https://cdn.hoanghamobile.com/images/products/2023/05/Nokia-xr21-thumb.png', 0),
((SELECT product_id FROM Products WHERE name = N'Nokia XR21'), N'https://cdn.hoanghamobile.com/images/products/2023/05/Nokia-xr21-black.png', 1),
((SELECT product_id FROM Products WHERE name = N'Nokia XR21'), N'https://cdn.hoanghamobile.com/images/products/2023/05/Nokia-xr21-green.png', 2);
GO

-- Chèn dữ liệu mẫu cho bảng Product_Reviews (35 đánh giá mới, tương ứng với 35 sản phẩm đã chèn)
INSERT INTO Product_Reviews (product_id, user_id, rating, comment) VALUES
-- Đánh giá cho Điện thoại Samsung
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24 Ultra'), (SELECT user_id FROM Users WHERE username = N'customer_01'), 5, N'Camera 200MP xuất sắc, S Pen cực kỳ tiện lợi cho công việc và ghi chú.'),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy S24+'), (SELECT user_id FROM Users WHERE username = N'customer_02'), 4, N'Màn hình lớn và sắc nét, hiệu năng mượt mà, rất đáng giá.'),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy A55 5G'), (SELECT user_id FROM Users WHERE username = N'customer_03'), 5, N'Pin rất trâu, thiết kế đẹp và bền bỉ, phù hợp với mọi nhu cầu.'),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy Z Flip5'), (SELECT user_id FROM Users WHERE username = N'customer_04'), 5, N'Thiết kế gập độc đáo, màn hình phụ tiện ích, rất thời trang.'),
((SELECT product_id FROM Products WHERE name = N'Samsung Galaxy M15 5G'), (SELECT user_id FROM Users WHERE username = N'customer_05'), 4, N'Pin 6000mAh dùng cả ngày không lo hết, hiệu năng ổn định trong tầm giá.'),

-- Đánh giá cho Điện thoại Apple
((SELECT product_id FROM Products WHERE name = N'iPhone 15 Pro Max'), (SELECT user_id FROM Users WHERE username = N'customer_06'), 5, N'Chụp ảnh đỉnh cao, chip A17 Pro cực kỳ mạnh mẽ, không có gì để chê.'),
((SELECT product_id FROM Products WHERE name = N'iPhone 15'), (SELECT user_id FROM Users WHERE username = N'customer_07'), 4, N'Dynamic Island rất thú vị, camera 48MP cho ảnh đẹp, USB-C tiện lợi.'),
((SELECT product_id FROM Products WHERE name = N'iPhone SE (2022)'), (SELECT user_id FROM Users WHERE username = N'customer_08'), 5, N'Kích thước nhỏ gọn dễ cầm, hiệu năng vẫn rất tốt với chip A15 Bionic.'),
((SELECT product_id FROM Products WHERE name = N'iPad Air 11-inch (M2)'), (SELECT user_id FROM Users WHERE username = N'customer_09'), 5, N'Sức mạnh của chip M2 trên iPad Air thật ấn tượng, màn hình đẹp.'),
((SELECT product_id FROM Products WHERE name = N'Apple Watch Series 9'), (SELECT user_id FROM Users WHERE username = N'customer_10'), 4, N'Nhiều tính năng sức khỏe hữu ích, thiết kế đẹp và thời trang.'),

-- Đánh giá cho Điện thoại Xiaomi
((SELECT product_id FROM Products WHERE name = N'Xiaomi 14 Ultra'), (SELECT user_id FROM Users WHERE username = N'customer_11'), 5, N'Camera Leica chất lượng chuyên nghiệp, hiệu năng mượt mà.'),
((SELECT product_id FROM Products WHERE name = N'Redmi Note 13 Pro 5G'), (SELECT user_id FROM Users WHERE username = N'customer_12'), 4, N'Màn hình 120Hz mượt mà, camera 200MP chụp ảnh chi tiết.'),
((SELECT product_id FROM Products WHERE name = N'Xiaomi 14'), (SELECT user_id FROM Users WHERE username = N'customer_13'), 5, N'Thiết kế nhỏ gọn nhưng hiệu năng flagship, rất hài lòng.'),
((SELECT product_id FROM Products WHERE name = N'Poco X6 Pro'), (SELECT user_id FROM Users WHERE username = N'customer_14'), 4, N'Hiệu năng gaming trong tầm giá rất tốt, chiến game mượt mà.'),
((SELECT product_id FROM Products WHERE name = N'Redmi 13C'), (SELECT user_id FROM Users WHERE username = N'customer_15'), 5, N'Điện thoại giá rẻ nhưng đủ dùng, pin ổn định cho nhu cầu cơ bản.'),

-- Đánh giá cho Điện thoại OPPO
((SELECT product_id FROM Products WHERE name = N'OPPO Find X7 Ultra'), (SELECT user_id FROM Users WHERE username = N'customer_16'), 5, N'Camera Hasselblad quá đỉnh, thiết kế sang trọng và độc đáo.'),
((SELECT product_id FROM Products WHERE name = N'OPPO Reno11 F 5G'), (SELECT user_id FROM Users WHERE username = N'customer_17'), 4, N'Sạc nhanh SuperVOOC rất tiện lợi, thiết kế mỏng nhẹ dễ cầm nắm.'),
((SELECT product_id FROM Products WHERE name = N'OPPO A60'), (SELECT user_id FROM Users WHERE username = N'customer_18'), 5, N'Pin trâu bò, hiệu năng ổn định cho các tác vụ hàng ngày, giá tốt.'),
((SELECT product_id FROM Products WHERE name = N'OPPO Find N3 Flip'), (SELECT user_id FROM Users WHERE username = N'customer_19'), 5, N'Điện thoại gập thời trang, camera chụp selfie cực đẹp.'),
((SELECT product_id FROM Products WHERE name = N'OPPO A38'), (SELECT user_id FROM Users WHERE username = N'customer_01'), 4, N'Giá rẻ nhưng chất lượng tốt, phù hợp cho học sinh, sinh viên.'),

-- Đánh giá cho Điện thoại Vivo
((SELECT product_id FROM Products WHERE name = N'Vivo X100 Pro'), (SELECT user_id FROM Users WHERE username = N'customer_02'), 5, N'Camera Zeiss cho ảnh chân thực, hiệu năng mạnh mẽ cân mọi tác vụ.'),
((SELECT product_id FROM Products WHERE name = N'Vivo V30e 5G'), (SELECT user_id FROM Users WHERE username = N'customer_03'), 4, N'Thiết kế mỏng nhẹ, camera chân dung đẹp, pin lớn dùng lâu.'),
((SELECT product_id FROM Products WHERE name = N'Vivo Y28 5G'), (SELECT user_id FROM Users WHERE username = N'customer_04'), 5, N'Pin 6000mAh đúng là điểm cộng lớn, sạc nhanh cũng rất tiện.'),
((SELECT product_id FROM Products WHERE name = N'Vivo Y03'), (SELECT user_id FROM Users WHERE username = N'customer_05'), 4, N'Điện thoại siêu rẻ, đủ dùng cho nhu cầu cơ bản, pin cũng khá.'),
((SELECT product_id FROM Products WHERE name = N'Vivo X Fold3 Pro'), (SELECT user_id FROM Users WHERE username = N'customer_06'), 5, N'Điện thoại gập siêu mỏng, trải nghiệm sử dụng cao cấp, đáng tiền.'),

-- Đánh giá cho Điện thoại Realme
((SELECT product_id FROM Products WHERE name = N'Realme 12 Pro+'), (SELECT user_id FROM Users WHERE username = N'customer_07'), 5, N'Camera zoom tiềm vọng ấn tượng, thiết kế sang trọng như đồng hồ cao cấp.'),
((SELECT product_id FROM Products WHERE name = N'Realme C65'), (SELECT user_id FROM Users WHERE username = N'customer_08'), 4, N'Pin lớn, sạc nhanh, rất bền bỉ, dùng ổn định cho nhu cầu hàng ngày.'),
((SELECT product_id FROM Products WHERE name = N'Realme GT Neo 6 SE'), (SELECT user_id FROM Users WHERE username = N'customer_09'), 5, N'Hiệu năng gaming cực kỳ mạnh mẽ, màn hình sáng và mượt mà.'),
((SELECT product_id FROM Products WHERE name = N'Realme Note 50'), (SELECT user_id FROM Users WHERE username = N'customer_10'), 4, N'Giá siêu tốt, thiết kế mỏng nhẹ, pin bền, điện thoại phụ tuyệt vời.'),
((SELECT product_id FROM Products WHERE name = N'Realme P1 Pro 5G'), (SELECT user_id FROM Users WHERE username = N'customer_11'), 5, N'Màn hình cong AMOLED rất đẹp, hiệu năng mượt mà, hài lòng.'),

-- Đánh giá cho Điện thoại Nokia
((SELECT product_id FROM Products WHERE name = N'Nokia C32'), (SELECT user_id FROM Users WHERE username = N'customer_12'), 4, N'Pin lớn dùng thoải mái, thiết kế chắc chắn, Android Go nhẹ nhàng.'),
((SELECT product_id FROM Products WHERE name = N'Nokia G400 5G'), (SELECT user_id FROM Users WHERE username = N'customer_13'), 5, N'Điện thoại tầm trung 5G với màn hình 120Hz mượt mà, đáng giá.'),
((SELECT product_id FROM Products WHERE name = N'Nokia 105'), (SELECT user_id FROM Users WHERE username = N'customer_14'), 5, N'Điện thoại phổ thông huyền thoại, pin siêu trâu, rất tiện lợi cho liên lạc.'),
((SELECT product_id FROM Products WHERE name = N'Nokia C21 Plus'), (SELECT user_id FROM Users WHERE username = N'customer_15'), 4, N'Giá rẻ, thiết kế bền bỉ, pin dùng cả ngày, rất ổn cho người lớn tuổi.'),
((SELECT product_id FROM Products WHERE name = N'Nokia XR21'), (SELECT user_id FROM Users WHERE username = N'customer_16'), 5, N'Điện thoại siêu bền, chống nước, chống va đập, phù hợp cho công việc đặc thù.');
GO


-- Chèn dữ liệu mẫu cho bảng Promotions (20 promotions)
INSERT INTO Promotions (code, discount_type, discount_value, min_order_amount, start_date, end_date, usage_limit, used_count, is_active) VALUES
(N'SUMMER25', N'PERCENTAGE', 25.00, 200.00, '2025-07-01', '2025-08-31', 150, 15, 1),
(N'FREESHIPVN', N'FIXED_AMOUNT', 0.00, 50.00, '2025-01-01', '2025-12-31', NULL, 75, 1),
(N'TECHWEEK50', N'FIXED_AMOUNT', 50.00, 1000.00, '2025-07-15', '2025-07-22', 80, 10, 1),
(N'BACKTOSCHOOL15', N'PERCENTAGE', 15.00, 300.00, '2025-08-15', '2025-09-30', 100, 12, 1),
(N'VIPLOYALTY10', N'PERCENTAGE', 10.00, 0.00, '2025-01-01', '2025-12-31', NULL, 30, 1),
(N'NEWCUSTOMER30', N'FIXED_AMOUNT', 30.00, 150.00, '2025-06-01', '2025-12-31', 200, 25, 1),
(N'MONTHLYSALE', N'PERCENTAGE', 10.00, 100.00, '2025-06-01', '2025-06-30', 120, 50, 0), -- Đã hết hạn
(N'GADGETDEAL', N'FIXED_AMOUNT', 75.00, 1500.00, '2025-06-25', '2025-07-05', 40, 5, 1),
(N'WEEKEND20', N'PERCENTAGE', 20.00, 80.00, '2025-06-27', '2025-06-29', 70, 8, 1),
(N'APPREWARDS5', N'PERCENTAGE', 5.00, 0.00, '2025-06-01', '2025-11-30', NULL, 40, 1),
(N'FLASH24H', N'PERCENTAGE', 30.00, 500.00, '2025-06-27', '2025-06-28', 20, 2, 1), -- Flash sale
(N'BUYMORESAVE', N'FIXED_AMOUNT', 100.00, 2000.00, '2025-07-01', '2025-07-31', 10, 1, 1),
(N'STUDENT10', N'PERCENTAGE', 10.00, 100.00, '2025-09-01', '2025-10-31', 50, 0, 1),
(N'HAPPYHOUR', N'FIXED_AMOUNT', 20.00, 100.00, '2025-06-27', '2025-06-27 18:00:00', 30, 10, 1), -- Hết hạn hôm nay
(N'BIRTHDAYGIFT', N'PERCENTAGE', 12.00, 50.00, '2025-01-01', '2025-12-31', 500, 20, 1),
(N'ECOFRIENDLY', N'PERCENTAGE', 7.00, 70.00, '2025-06-01', '2025-09-30', NULL, 5, 1),
(N'GAMINGGEAR', N'FIXED_AMOUNT', 40.00, 800.00, '2025-07-01', '2025-07-14', 25, 3, 1),
(N'HOMEAUTOMATION', N'PERCENTAGE', 18.00, 400.00, '2025-08-01', '2025-08-31', 35, 2, 1),
(N'HOLIDAYDEAL', N'PERCENTAGE', 20.00, 250.00, '2025-12-01', '2025-12-31', 200, 0, 1),
(N'MEMBERSALE', N'FIXED_AMOUNT', 25.00, 120.00, '2025-06-20', '2025-07-20', 100, 7, 1);
GO

-- Chèn dữ liệu mẫu cho bảng Sliders (5 sliders)
INSERT INTO Sliders (image_url, link_url, title, description, status, order_number) VALUES
(N'https://img.global.news.samsung.com/vn/wp-content/uploads/2024/07/Galaxy-Z-Fold6-and-Flip6-728x410.jpg', N'https://news.samsung.com/vn/samsung-chinh-thuc-ra-mat-galaxy-z-fold6-va-z-flip6-galaxy-ai-vuon-tam-cao-moi', N'Samsung Galaxy Z Fold6/Flip6', N'Mở ra kỷ nguyên mới với điện thoại gập thông minh.', N'active', 1),
(N'https://didongxanh.com.vn/wp-content/uploads/2024/10/iphone16-1.jpg', N'https://www.thegioididong.com/dtdd/iphone-16-pro-max', N'iPhone 16 Pro Max', N'Nâng tầm trải nghiệm di động với hiệu năng vượt trội.', N'active', 2),
(N'https://file.hstatic.net/200000845283/article/oppo-reno-12-series-1_25d3b665fd5e4f04ac88a2a373d3b941.jpg', N'https://innoshop.vn/blogs/thong-tin-cong-nghe/oppo-reno12-series-thiet-ke-dinh-cao-but-pha-cong-nghe?srsltid=AfmBOor6kZZcunEJfKO789zsV5gs3bFfyNtJjLXsUgDvje8rIZ_nbnPf', N'OPPO Reno12 Series', N'Chụp ảnh đỉnh cao, thiết kế thời thượng.', N'active', 3),
(N'https://news.khangz.com/wp-content/uploads/2024/05/mau-sac-xiaomi-14-ultra-1-1.jpg', N'https://viettelstore.vn/tin-tuc/mau-sac-xiaomi-14-ultra', N'Xiaomi 14 Ultra', N'Sức mạnh nhiếp ảnh di động chuyên nghiệp.', N'active', 4),
(N'https://macone.vn/wp-content/uploads/2024/09/Apple-MacBook-Air-2-up-hero-240304.jpg', N'https://macone.vn/macbook-air-m3/?srsltid=AfmBOopQJWxt_M3csS4ZvDgU0jCBRQwUn12qc6FoO94uZ3GZXtW6z-zL', N'MacBook Air M3', N'Hiệu năng mạnh mẽ, thiết kế siêu mỏng nhẹ.', N'active', 5);
GO

PRINT N'✅ Dữ liệu mẫu mới đã được chèn thành công vào MiniMartDB với khoảng 20 dòng mỗi bảng.';