# Spring Boot E-Commerce Platform

A full-stack e-commerce application built with React and Spring Boot, featuring modern animations, responsive design, and complete shopping functionality.

## Key Features

- 🛍️ **Shopping**: Product browsing, filtering, real-time cart, secure checkout
- 🎨 **Modern UI**: React animations with Framer Motion and Tailwind CSS
- 👨‍💼 **Admin Dashboard**: Manage products, categories, and customer orders
- 💳 **Payment**: Stripe payment gateway integration
- 🔐 **Security**: JWT authentication, role-based access control, password encryption
- 📱 **Responsive**: Mobile-first design for all devices

## Tech Stack

### Frontend
- **React.js 18.2** - UI library with hooks
- **Framer Motion 12.38** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Router** - Client-side navigation

### Backend
- **Java 8/11** - Programming language
- **Spring Boot 2.6.6** - Web framework
- **Spring Data JPA** - ORM for database operations
- **Spring Security** - Authentication & authorization
- **Maven** - Build and dependency management

### Database
- **MySQL** - Relational database
- **Hibernate** - JPA implementation

### Deployment
- **Render.com** (Free tier) or similar cloud platform
- **Docker** compatible
- **CI/CD** ready with GitHub Actions

## Installation

### Prerequisites
- **Java 8+** or **Java 11**
- **Node.js 18+**
- **Maven 3.6+**
- **MySQL 8.0+**
- **Git**

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Darshan2042/spring-boot-ecommerce.git
   cd spring-boot-ecommerce
   ```

2. **Set Up Database**
   - Create a MySQL database:
     ```sql
     CREATE DATABASE ecommerce_db;
     ```
   - Update `src/main/resources/application.properties` with your database credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
     spring.datasource.username=root
     spring.datasource.password=your_password
     ```

3. **Build Backend**
   ```bash
   mvn clean install
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Run the Application**
   
   **Option A: Both services separately**
   ```bash
   # Terminal 1 - Spring Boot backend (runs on http://localhost:8080)
   mvn spring-boot:run
   
   # Terminal 2 - React frontend (runs on http://localhost:3000)
   cd frontend
   npm start
   ```
   
   **Option B: Using provided scripts**
   ```bash
   # Windows
   ./START_APPLICATION.bat
   
   # Linux/Mac
   bash start_application.sh
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - H2 Database Console: http://localhost:8080/h2-console (if using H2)

## Usage

### For Customers
- Browse and filter products from home page
- Add items to cart and proceed to checkout
- Make payment with test Stripe card (4242 4242 4242 4242)
- Track orders in account history

### For Admins
- Login at `/admin-login` with admin credentials
- Add, edit, or delete products
- Manage product categories
- View and update customer orders

## API Endpoints

### Authentication
- `POST /api/auth/login` - Customer login
- `POST /api/auth/register` - Customer registration
- `POST /api/admin/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details

### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/{itemId}` - Remove from cart

## Project Structure

```
├── frontend/                  # React application
│   └── src/
│       ├── components/       # Reusable React components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── styles/          # Global styles
├── src/main/java/           # Spring Boot backend
│   ├── entity/              # Database models
│   ├── controller/          # REST endpoints
│   ├── service/             # Business logic
│   └── security/            # JWT authentication
├── pom.xml                  # Maven dependencies
└── README.md
```

## Screen Shots


