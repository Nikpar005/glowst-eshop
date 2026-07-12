# 🌟 Glowst E-shop - Full Stack Application

A complete and modern e-commerce application built with **FastAPI** on the Backend and **React** on the Frontend. The application features a comprehensive management system (Admin Panel), dynamic product searching, and an integrated checkout flow powered by **Stripe**.

---

## 🚀 Technologies Used

### Backend (API)
* **Python 3.13+** - The core programming language of the backend.
* **FastAPI** - High-performance framework for building the REST API.
* **SQLAlchemy** - ORM for secure and seamless database communication.
* **SQLite** - Lightweight and reliable SQL database for storing products, variants, and administrators.
* **Bcrypt & JWT (JSON Web Tokens)** - Modern and secure mechanisms for password hashing (Python 3.13 compatible) and administrator authentication.
* **Uvicorn** - Lightning-fast ASGI server to run the application.
* **Stripe SDK** - Official library for processing payments and creating Checkout Sessions.

### Frontend
* **React.js** - Component-based library for the store's User Interface.
* **Tailwind CSS** - For modern, clean, and responsive styling.

---

## 🛠️ Features

* **Secure Admin Panel:** Admin authentication flow utilizing encrypted passwords (Bcrypt) and protected routes via JWT tokens.
* **Complex Product Management:** Support for products with multiple variations (Variants) including specific colors, sizes, and dedicated stock limits per variant.
* **Dynamic Search & Filter:** Live product searching from the Frontend based on name or description, optimized with database eager loading (`joinedload`) to prevent N+1 query issues.
* **Stripe Payments:** Full integration of Stripe Checkout for secure credit/debit card transactions.
* **Stability & Logging:** Global exception handling middleware to catch unforeseen server errors and custom middleware for response time tracking.

---

## 💻 Local Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/glowst-eshop.git](https://github.com/YOUR_USERNAME/glowst-eshop.git)
cd glowst-eshop/backend
