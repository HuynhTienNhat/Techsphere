# Techsphere - E-Commerce Platform

A full-stack e-commerce web application built with Spring Boot and React, featuring a comprehensive admin dashboard and customer shopping interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Techsphere is a modern e-commerce platform that provides a seamless shopping experience for customers and powerful management tools for administrators. The application features product browsing, shopping cart, checkout process, order management, and user administration.

## ✨ Features

### Customer Features
- 🏠 **Home Page** - Browse featured products and promotions
- 🛍️ **Product Catalog** - View and search products with filtering options
- 🔍 **Product Details** - Detailed product information and specifications
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- 💳 **Checkout** - Complete purchase with address selection
- 👤 **User Profile** - Manage personal information and order history
- 🔐 **Authentication** - Login, registration, password reset, and email verification
- 📜 **Information Pages** - About us, privacy policy, and terms of service

### Admin Features
- 📊 **Dashboard** - Overview with revenue charts and key metrics
- 📦 **Product Management** - Add, edit, and manage product inventory
- 📋 **Order Management** - View and process customer orders
- 👥 **User Management** - Manage customer accounts and details
- 🔍 **Search & Filter** - Advanced filtering and search capabilities

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.4.4
- **Language**: Java 17
- **Database**: MySQL 8
- **ORM**: Hibernate/JPA
- **Security**: JWT Authentication
- **Email**: Spring Mail
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Material-UI 7.0
- **Icons**: FontAwesome, React Icons, Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7.4
- **Notifications**: React Toastify
- **Charts**: Recharts 2.15
- **Carousel**: Swiper 11.2

## 📁 Project Structure

```
Techsphere/
├── BEsub/                          # Backend application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/    # Java source code
│   │   │   └── resources/
│   │   │       └── application.yml # Application configuration
│   │   └── test/                   # Test files
│   ├── pom.xml                     # Maven dependencies
│   └── target/                     # Build output
│
└── FE/                             # Frontend application
    ├── src/
    │   ├── assets/                 # Static assets (images, data)
    │   ├── components/             # Reusable components
    │   │   ├── admin/              # Admin components
    │   │   └── customer/           # Customer components
    │   ├── layouts/                # Layout components
    │   ├── pages/                  # Page components
    │   │   ├── Admin/              # Admin pages
    │   │   ├── Auth/               # Authentication pages
    │   │   └── Customer/           # Customer pages
    │   ├── routes/                 # Route protection
    │   ├── services/               # API services
    │   ├── App.jsx                 # Main App component
    │   └── main.jsx                # Entry point
    ├── package.json                # NPM dependencies
    └── vite.config.js              # Vite configuration
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)** 17 or higher
- **Maven** 3.6 or higher
- **Node.js** 18 or higher
- **npm** or **yarn**
- **MySQL** 8.0 or higher
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Techsphere
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE pbl3;
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd BEsub
```

Install dependencies (Maven will handle this automatically):

```bash
mvn clean install
```

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../FE
```

Install dependencies:

```bash
npm install
```

## ⚙️ Configuration

### Backend Configuration

Edit `BEsub/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/pbl3?useSSL=false&allowPublicKeyRetrieval=true
    username: your_mysql_username
    password: your_mysql_password

  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password
```

**Note**: For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) for the mail configuration.

### Frontend Configuration

Create or edit `FE/src/services/api.js` to configure the backend API URL:

```javascript
const API_BASE_URL = 'http://localhost:8080';
```

## 🏃 Running the Application

### Start the Backend Server

```bash
cd BEsub
mvn spring-boot:run
```

The backend server will start at `http://localhost:8080`

### Start the Frontend Development Server

In a new terminal:

```bash
cd FE
npm run dev
```

The frontend will start at `http://localhost:5173`

### Access the Application

- **Customer Interface**: http://localhost:5173
- **Admin Interface**: http://localhost:5173/admin
- **Backend API**: http://localhost:8080

## 📚 API Documentation

The backend provides RESTful APIs for:

- **Authentication**: User registration, login, password reset
- **Products**: CRUD operations for products
- **Orders**: Order creation and management
- **Users**: User profile and management
- **Cart**: Shopping cart operations

### Example API Endpoints

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/products               # Get all products
GET    /api/products/{id}          # Get product by ID
POST   /api/products               # Create new product (Admin)
PUT    /api/products/{id}          # Update product (Admin)
DELETE /api/products/{id}          # Delete product (Admin)
GET    /api/orders                 # Get orders
POST   /api/orders                 # Create order
GET    /api/users                  # Get users (Admin)
```

## 🖼️ Screenshots

_Add screenshots of your application here_

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Material-UI Components
- Tailwind CSS

---

**Note**: Make sure to update the configuration files with your actual credentials before running the application. Never commit sensitive information like passwords or API keys to version control.
