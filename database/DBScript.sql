USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'MiniMartDB')
BEGIN
    ALTER DATABASE MiniMartDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE MiniMartDB;
END;
GO

CREATE DATABASE MiniMartDB;
GO

USE MiniMartDB;
GO

CREATE TABLE Users (
    user_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    phone NVARCHAR(20) NULL,
    full_name NVARCHAR(100) NULL,
    avatar_url NVARCHAR(MAX) NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL
);
GO

CREATE TABLE Addresses (
    address_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    receiver_name NVARCHAR(100) DEFAULT N'Khách Hàng',
    phone VARCHAR(20) DEFAULT '0123456789',
    street NVARCHAR(255) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NULL,
    zip_code NVARCHAR(10) NULL,
    is_default BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Addresses_Users FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE
);
GO

CREATE TABLE Categories (
    category_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    image_url NVARCHAR(MAX) NULL,
    status VARCHAR(20) DEFAULT 'active'
);
GO

CREATE TABLE Products (
    product_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name NVARCHAR(255) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    thumbnail_url NVARCHAR(MAX) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    CONSTRAINT FK_Products_Categories FOREIGN KEY (category_id) REFERENCES Categories (category_id)
);
GO

CREATE TABLE Product_Images (
    image_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url NVARCHAR(MAX) NOT NULL,
    sort_order INT DEFAULT 0,
    CONSTRAINT FK_Product_Images_Products FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE
);
GO

CREATE TABLE Cart_Items (
    cart_item_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    added_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    CONSTRAINT UQ_UserProductCart UNIQUE (user_id, product_id),
    CONSTRAINT FK_Cart_Items_Users FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE,
    CONSTRAINT FK_Cart_Items_Products FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE
);
GO

CREATE TABLE Orders (
    order_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_code NVARCHAR(50) NOT NULL UNIQUE,
    order_date DATETIME2 DEFAULT GETDATE(),
    total_amount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    shipping_address NVARCHAR(500) NOT NULL,
    payment_method NVARCHAR(50) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    CONSTRAINT FK_Orders_Users FOREIGN KEY (user_id) REFERENCES Users (user_id)
);
GO

CREATE TABLE Order_Items (
    order_item_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_Order_Items_Orders FOREIGN KEY (order_id) REFERENCES Orders (order_id) ON DELETE CASCADE,
    CONSTRAINT FK_Order_Items_Products FOREIGN KEY (product_id) REFERENCES Products (product_id)
);
GO

CREATE TABLE Transactions (
    transaction_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATETIME2 DEFAULT GETDATE(),
    payment_status NVARCHAR(20) NOT NULL,
    gateway_transaction_id NVARCHAR(255) NULL,
    gateway_response NVARCHAR(MAX) NULL,
    CONSTRAINT FK_Transactions_Orders FOREIGN KEY (order_id) REFERENCES Orders (order_id)
);
GO

CREATE TABLE Product_Reviews (
    review_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment NVARCHAR(MAX) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT UQ_UserProductReview UNIQUE (user_id, product_id),
    CONSTRAINT FK_Product_Reviews_Products FOREIGN KEY (product_id) REFERENCES Products (product_id) ON DELETE CASCADE,
    CONSTRAINT FK_Product_Reviews_Users FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE
);
GO

CREATE TABLE Promotions (
    promotion_id BIGINT IDENTITY(1,1) PRIMARY KEY,
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
    updated_at DATETIME2 NULL
);
GO

CREATE TABLE sliders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    image_url NVARCHAR(MAX) NOT NULL,
    link_url NVARCHAR(MAX) NULL,
    title NVARCHAR(255) NULL,
    description NVARCHAR(MAX) NULL,
    status NVARCHAR(50) DEFAULT 'active',
    order_number INT DEFAULT 0
);
GO

CREATE TRIGGER TRG_Users_UpdatedAt ON Users AFTER UPDATE AS
BEGIN
    UPDATE Users SET updated_at = GETDATE() FROM Users u INNER JOIN INSERTED i ON u.user_id = i.user_id;
END;
GO

CREATE TRIGGER TRG_Products_UpdatedAt ON Products AFTER UPDATE AS
BEGIN
    UPDATE Products SET updated_at = GETDATE() FROM Products p INNER JOIN INSERTED i ON p.product_id = i.product_id;
END;
GO

CREATE TRIGGER TRG_Cart_Items_UpdatedAt ON Cart_Items AFTER UPDATE AS
BEGIN
    UPDATE Cart_Items SET updated_at = GETDATE() FROM Cart_Items ci INNER JOIN INSERTED i ON ci.cart_item_id = i.cart_item_id;
END;
GO

CREATE TRIGGER TRG_Orders_UpdatedAt ON Orders AFTER UPDATE AS
BEGIN
    UPDATE Orders SET updated_at = GETDATE() FROM Orders o INNER JOIN INSERTED i ON o.order_id = i.order_id;
END;
GO

CREATE TRIGGER TRG_Promotions_UpdatedAt ON Promotions AFTER UPDATE AS
BEGIN
    UPDATE Promotions SET updated_at = GETDATE() FROM Promotions p INNER JOIN INSERTED i ON p.promotion_id = i.promotion_id;
END;
GO