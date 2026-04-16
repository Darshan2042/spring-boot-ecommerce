# Spring Boot E-Commerce Platform

A full-stack e-commerce application built with React and Spring Boot, featuring modern animations, responsive design, and complete shopping functionality.

## Features

### 🛍️ Shopping Experience
- Browse products with animated product cards and hover effects
- Advanced filtering by category and price range
- Real-time shopping cart with animated badge updates
- Smooth checkout process with order confirmation
- Order history and tracking for customers

### 🎨 Modern UI/UX
- **React Animations**: Custom hooks and Framer Motion for smooth transitions
- **Scroll Animations**: Interactive elements that animate on scroll
- **Staggered Lists**: Products load with cascading animations
- **Floating Labels**: Animated form inputs with floating labels
- **Page Transitions**: Smooth Suspense-powered page transitions
- **Cart Badge Bounce**: Animated counter with pop effect
- **Loading Spinners**: Pulsing animations during data fetching

### 👨‍💼 Admin Dashboard
- Secure admin login with JWT authentication
- Add, edit, delete products
- Manage product categories
- View and manage customer orders
- Real-time order status updates

### 💳 Payment Integration
- Stripe payment gateway integration
- Support for test and live API keys
- Secure transaction handling

### 🔐 Security
- JWT-based authentication
- Role-based access control (Customer/Admin)
- Password encryption
- Secure API endpoints
- Environment-based configuration

### 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS for responsive styling
- Works seamlessly on desktop, tablet, and mobile

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

1. **Browse Products**
   - Visit the home page to see featured products
   - Use search and filters to find products
   - Click on products to view details

2. **Shopping Cart**
   - Add products to cart from product pages
   - View cart by clicking the cart icon
   - Adjust quantities or remove items
   - See real-time cart totals

3. **Checkout**
   - Proceed to checkout from cart page
   - Enter shipping information
   - Complete payment with test Stripe card
   - Receive order confirmation

4. **Order History**
   - Login to view your orders
   - Track order status
   - Download invoices (if available)

### For Admins

1. **Admin Login**
   - Navigate to `/admin-login`
   - Use admin credentials
   - Access admin dashboard

2. **Manage Products**
   - Add new products with images and descriptions
   - Edit existing product details
   - Delete products from inventory
   - Manage product categories

3. **View Orders**
   - See all customer orders
   - Update order status
   - View order details and customer information

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

## Testing

### Run Backend Tests
```bash
mvn test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Using Test Credentials

**Admin Login:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Test Stripe Card:**
- Card Number: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`


## Project Structure

```
spring-boot-ecommerce/
├── frontend/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   ├── pages/                    # Page components
│   │   ├── hooks/                    # Custom React hooks (animations)
│   │   ├── services/                 # API services
│   │   ├── context/                  # React context
│   │   └── styles/                   # Global styles & theme
│   ├── package.json
│   └── README.md
├── src/
│   ├── main/java/com/luv2code/
│   │   └── ecommerce/
│   │       ├── entity/               # JPA entities
│   │       ├── repository/           # Repository interfaces
│   │       ├── service/              # Business logic
│   │       ├── controller/           # REST controllers
│   │       ├── config/               # Spring configuration
│   │       └── security/             # JWT & security
│   ├── main/resources/
│   │   ├── application.properties    # Configuration
│   │   └── static/
│   └── test/
├── pom.xml                           # Maven dependencies
├── Procfile                          # Deployment configuration
├── build.sh                          # Build script
└── README.md
```

## Environment Variables

### Development
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=password
app.jwtSecret=dev-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Production
```properties
DATABASE_URL=mysql://user:pass@host:port/db_name
DATABASE_USER=root
DATABASE_PASSWORD=secure_password
JWT_SECRET=strong-random-secret-key
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
ALLOWED_ORIGINS=https://yourdomain.com
```

## Performance Optimizations

- 🚀 GPU-accelerated CSS animations (transform, opacity)
- 📦 Code splitting and lazy loading in React
- 🖼️ Image optimization and WebP support
- 💾 Caching strategies with HTTP headers
- 🔄 Database query optimization with JPA projections

## Troubleshooting

### Issue: Port 8080 already in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Issue: MySQL connection refused
```bash
# Check MySQL service
# Windows: Services > MySQL80
# Linux: sudo systemctl status mysql
# Mac: brew services list
```

### Issue: CORS errors
- Check `ALLOWED_ORIGINS` environment variable
- Verify backend is running on correct port
- Check frontend API endpoint configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- React.js and Spring Boot communities
- Framer Motion for animation library
- Tailwind CSS for styling
- Stripe for payment processing
- All contributors and supporters

Last Updated: April 2026
