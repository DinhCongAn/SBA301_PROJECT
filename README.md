# 🛒 MiniMart - Fullstack E-Commerce System

MiniMart is a modern Single Page Application (SPA) e-commerce platform built for the SBA301 course. It features a robust RESTful API backend, secure JWT authentication, and bi-directional real-time communication.

---

## ✨ Key Features
* 🔐 **Security:** JWT Authentication & Role-Based Access Control (Admin/Customer).
* 🛍️ **Shopping:** Cart management, discount codes, and secure checkout with database transactions.
* 🔔 **Real-time:** Two-way WebSocket notifications for order updates & live system logs.
* 📦 **Management:** Full CRUD operations for products, categories, and order processing dashboard.

---

## 💻 Tech Stack
* **Frontend:** ReactJS, Tailwind CSS, Axios, React Router DOM, SockJS & STOMP.
* **Backend:** Java 21, Spring Boot 3, Spring Security, Spring WebSockets, Spring Data JPA, Java Mail Sender.
* **Database:** Microsoft SQL Server.

---

## ⚙️ Quick Start

### 1. Database Setup
Create a database named `MiniMartDB` in SQL Server. Update the credentials in `backend/src/main/resources/application.properties`.

### 2. Backend (Spring Boot)
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Server runs on http://localhost:8080
```

### 3. Frontend (ReactJS)
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 👨‍💻 Author

**Đinh Công An**
* **Major:** Software Engineering
* **University:** FPT University Hanoi
* **Expected Graduation:** December 2026
