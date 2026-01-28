USE master;
GO

-- ❌ Xoá database cũ nếu đã tồn tại để tạo mới lại từ đầu
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'PhoneShopDB')
BEGIN
    ALTER DATABASE PhoneShopDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE PhoneShopDB;
END;
GO

-- ✅ Tạo mới cơ sở dữ liệu
CREATE DATABASE PhoneShopDB;
GO

-- ✅ Sử dụng database vừa tạo
USE PhoneShopDB;
GO

--------------------------------------------------------------------------------
-- 🧍‍♂️ Bảng Users: Lưu thông tin người dùng (admin, customer)
--------------------------------------------------------------------------------
CREATE TABLE Users (
    user_id BIGINT IDENTITY(1,1) NOT NULL,               -- ID người dùng (tự tăng)
    username NVARCHAR(50) NOT NULL UNIQUE,               -- Tên đăng nhập (duy nhất)
    password NVARCHAR(255) NOT NULL,                     -- Mật khẩu đã mã hoá
    email NVARCHAR(100) NOT NULL UNIQUE,                 -- Email (duy nhất)
    phone NVARCHAR(20) NULL,                             -- Số điện thoại
    full_name NVARCHAR(100) NULL,                        -- Họ tên đầy đủ
    role NVARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',       -- Vai trò: 'ADMIN' hoặc 'CUSTOMER'
    created_at DATETIME2 DEFAULT GETDATE(),              -- Ngày tạo
    updated_at DATETIME2 NULL,                           -- Ngày cập nhật
    PRIMARY KEY (user_id)
);
GO

-- 🔁 Trigger: cập nhật trường updated_at mỗi khi user bị update
CREATE TRIGGER TRG_Users_UpdatedAt
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users
    SET updated_at = GETDATE()
    FROM Users u
    INNER JOIN INSERTED i ON u.user_id = i.user_id;
END;
GO

--------------------------------------------------------------------------------
-- 🏠 Bảng Addresses: địa chỉ giao hàng của người dùng
--------------------------------------------------------------------------------
CREATE TABLE Addresses (
    address_id BIGINT IDENTITY(1,1) NOT NULL,
    user_id BIGINT NOT NULL,                             -- Khoá ngoại tới Users
    street NVARCHAR(255) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NULL,
    zip_code NVARCHAR(10) NULL,
    is_default BIT NOT NULL DEFAULT 0,                   -- Là địa chỉ mặc định hay không
    PRIMARY KEY (address_id),
    CONSTRAINT FK_Addresses_Users FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

--------------------------------------------------------------------------------
-- 🏷️ Bảng Categories: danh mục sản phẩm
--------------------------------------------------------------------------------
CREATE TABLE Categories (
    category_id BIGINT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    image_url NVARCHAR(255) NULL,                        -- Ảnh danh mục
    PRIMARY KEY (category_id)
);
GO

--------------------------------------------------------------------------------
-- 📱 Bảng Products: sản phẩm trong cửa hàng
--------------------------------------------------------------------------------
CREATE TABLE Products (
    product_id BIGINT IDENTITY(1,1) NOT NULL,
    category_id BIGINT NOT NULL,                         -- FK đến Categories
    name NVARCHAR(255) NOT NULL UNIQUE,                  -- Tên sản phẩm
    description NVARCHAR(MAX) NULL,                      -- Mô tả chi tiết
    price DECIMAL(10, 2) NOT NULL,                       -- Giá bán
    stock_quantity INT NOT NULL DEFAULT 0,               -- Tồn kho
    thumbnail_url NVARCHAR(500) NULL,                    -- Ảnh thumbnail
    status NVARCHAR(20) NOT NULL DEFAULT 'active',       -- Trạng thái: 'active' hoặc 'inactive'
    created_at DATETIME2 DEFAULT GETDATE(),              -- Ngày tạo
    updated_at DATETIME2 NULL,                           -- Ngày cập nhật
    PRIMARY KEY (product_id),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (category_id)
        REFERENCES Categories (category_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);
GO

-- 🔁 Trigger: cập nhật updated_at mỗi khi sản phẩm thay đổi
CREATE TRIGGER TRG_Products_UpdatedAt
ON Products
AFTER UPDATE
AS
BEGIN
    UPDATE Products
    SET updated_at = GETDATE()
    FROM Products p
    INNER JOIN INSERTED i ON p.product_id = i.product_id;
END;
GO

--------------------------------------------------------------------------------
-- 🖼️ Bảng Product_Images: ảnh phụ của sản phẩm
--------------------------------------------------------------------------------
CREATE TABLE Product_Images (
    image_id BIGINT IDENTITY(1,1) NOT NULL,
    product_id BIGINT NOT NULL,
    image_url NVARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,                            -- Thứ tự hiển thị
    PRIMARY KEY (image_id),
    CONSTRAINT FK_Product_Images_Products FOREIGN KEY (product_id)
        REFERENCES Products (product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

--------------------------------------------------------------------------------
-- 🛒 Bảng Cart_Items: các sản phẩm trong giỏ hàng của người dùng
--------------------------------------------------------------------------------
CREATE TABLE Cart_Items (
    cart_item_id BIGINT IDENTITY(1,1) NOT NULL,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    added_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    PRIMARY KEY (cart_item_id),
    CONSTRAINT UQ_UserProductCart UNIQUE (user_id, product_id),
    CONSTRAINT FK_Cart_Items_Users FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT FK_Cart_Items_Products FOREIGN KEY (product_id)
        REFERENCES Products (product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

-- 🔁 Trigger cập nhật updated_at khi cập nhật giỏ hàng
CREATE TRIGGER TRG_Cart_Items_UpdatedAt
ON Cart_Items
AFTER UPDATE
AS
BEGIN
    UPDATE Cart_Items
    SET updated_at = GETDATE()
    FROM Cart_Items ci
    INNER JOIN INSERTED i ON ci.cart_item_id = i.cart_item_id;
END;
GO

--------------------------------------------------------------------------------
-- 📦 Bảng Orders: đơn hàng của người dùng
--------------------------------------------------------------------------------
CREATE TABLE Orders (
    order_id BIGINT IDENTITY(1,1) NOT NULL,
    user_id BIGINT NOT NULL,
    order_code NVARCHAR(50) NOT NULL UNIQUE,
    order_date DATETIME2 DEFAULT GETDATE(),
    total_amount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    shipping_address NVARCHAR(500) NOT NULL,
    payment_method NVARCHAR(50) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    PRIMARY KEY (order_id),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);
GO

-- 🔁 Trigger cập nhật updated_at khi đơn hàng được sửa
CREATE TRIGGER TRG_Orders_UpdatedAt
ON Orders
AFTER UPDATE
AS
BEGIN
    UPDATE Orders
    SET updated_at = GETDATE()
    FROM Orders o
    INNER JOIN INSERTED i ON o.order_id = i.order_id;
END;
GO

--------------------------------------------------------------------------------
-- 📦 Bảng Order_Items: chi tiết từng sản phẩm trong đơn hàng
--------------------------------------------------------------------------------
CREATE TABLE Order_Items (
    order_item_id BIGINT IDENTITY(1,1) NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_item_id),
    CONSTRAINT FK_Order_Items_Orders FOREIGN KEY (order_id)
        REFERENCES Orders (order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT FK_Order_Items_Products FOREIGN KEY (product_id)
        REFERENCES Products (product_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);
GO

--------------------------------------------------------------------------------
-- 💸 Bảng Transactions: giao dịch thanh toán
--------------------------------------------------------------------------------
CREATE TABLE Transactions (
    transaction_id BIGINT IDENTITY(1,1) NOT NULL,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATETIME2 DEFAULT GETDATE(),
    payment_status NVARCHAR(20) NOT NULL,
    gateway_transaction_id NVARCHAR(255) NULL,
    gateway_response NVARCHAR(MAX) NULL,
    PRIMARY KEY (transaction_id),
    CONSTRAINT FK_Transactions_Orders FOREIGN KEY (order_id)
        REFERENCES Orders (order_id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);
GO

--------------------------------------------------------------------------------
-- 🌟 Bảng Product_Reviews: đánh giá sản phẩm
--------------------------------------------------------------------------------
CREATE TABLE Product_Reviews (
    review_id BIGINT IDENTITY(1,1) NOT NULL,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,                                 -- Điểm đánh giá 1-5
    comment NVARCHAR(MAX) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (review_id),
    CONSTRAINT UQ_UserProductReview UNIQUE (user_id, product_id),
    CONSTRAINT FK_Product_Reviews_Products FOREIGN KEY (product_id)
        REFERENCES Products (product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT FK_Product_Reviews_Users FOREIGN KEY (user_id)
        REFERENCES Users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

--------------------------------------------------------------------------------
-- 🎁 Bảng Promotions: mã khuyến mãi
--------------------------------------------------------------------------------
CREATE TABLE Promotions (
    promotion_id BIGINT IDENTITY(1,1) NOT NULL,
    code NVARCHAR(50) NOT NULL UNIQUE,
    discount_type NVARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) NULL,
    start_date DATETIME2 NOT NULL,
    end_date DATETIME2 NOT NULL,
    usage_limit INT NULL,
    used_count INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    PRIMARY KEY (promotion_id)
);
GO

-- 🔁 Trigger cập nhật updated_at khi cập nhật khuyến mãi
CREATE TRIGGER TRG_Promotions_UpdatedAt
ON Promotions
AFTER UPDATE
AS
BEGIN
    UPDATE Promotions
    SET updated_at = GETDATE()
    FROM Promotions p
    INNER JOIN INSERTED i ON p.promotion_id = i.promotion_id;
END;
GO

--------------------------------------------------------------------------------
-- 🖼️ Bảng sliders: dùng cho banner/slider quảng cáo
--------------------------------------------------------------------------------
CREATE TABLE sliders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    image_url NVARCHAR(255) NOT NULL,
    link_url NVARCHAR(255),
    title NVARCHAR(255),
    description NVARCHAR(MAX),
    status NVARCHAR(50) DEFAULT 'active',
    order_number INT DEFAULT 0
);
GO

--------------------------------------------------------------------------------
-- ✅ THÔNG BÁO HOÀN TẤT
--------------------------------------------------------------------------------
PRINT '✅ Cơ sở dữ liệu PhoneShopDB và tất cả các bảng đã được tạo thành công.';
