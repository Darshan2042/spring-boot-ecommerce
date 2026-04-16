# React Frontend Setup with Tailwind CSS

This directory contains the React frontend for ShopHub, built with:
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Project Structure

```
frontend/
├── public/               # Static HTML template
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Navbar.js    # Navigation bar
│   │   ├── AuthModal.js # Login/Register modal
│   │   └── Notification.js # Notification alerts
│   ├── pages/           # Page components
│   │   ├── HomePage.js
│   │   ├── ProductsPage.js
│   │   ├── CartPage.js
│   │   └── OrdersPage.js
│   ├── context/         # React Context for state management
│   │   └── AppContext.js # Global app state
│   ├── services/        # API services
│   │   └── apiService.js # Backend API wrapper
│   ├── App.js           # Root component
│   ├── index.js         # React DOM render
│   └── index.css        # Global/Tailwind styles
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Setup Instructions

### 1. Install Dependencies

From the project root directory:

```powershell
cd frontend
npm install
```

### 2. Development Server

Run the React development server:

```powershell
npm start
```

The app will be available at `http://localhost:3000`

### 3. Build for Production

Build the optimized production build:

```powershell
npm run build
```

This creates a `build/` directory with optimized files.

### 4. Integrate with Spring Boot

To use with the Spring Boot backend:

**Option A: Use the provided build script (Windows)**
```powershell
.\build-frontend.bat
```

**Option B: Manual steps**
```powershell
# From frontend directory
npm run build

# Copy build to Spring Boot
Copy-Item -Path "build\*" -Destination "..\src\main\resources\static\" -Recurse -Force
```

Then start Spring Boot normally:
```powershell
mvn clean compile spring-boot:run
```

## Features

✨ **Modern UI with Tailwind CSS**
- Responsive design
- Smooth animations
- Professional color scheme (indigo & amber)
- Mobile-first approach

🧩 **React Components**
- Navbar with navigation and cart badge
- Product grid with filtering
- Shopping cart management
- Order history display
- Authentication modal

🔌 **API Integration**
- Axios-based API service
- JWT token management
- Automatic authorization headers
- Error handling

📦 **State Management**
- React Context API
- Persistent localStorage
- Global notification system
- Cart management

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from create-react-app (one-way operation)

## Tailwind CSS Configuration

Tailwind is configured with:
- Extended color scheme (primary: indigo, accent: amber)
- Custom animations (fadeIn, slideUp)
- Responsive prefixes (sm:, md:, lg:)

See `tailwind.config.js` for full configuration.

## API Endpoints

The frontend communicates with the Spring Boot backend at `http://localhost:8080/api`

Key endpoints used:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /products` - Fetch products
- `GET /product-categories` - Fetch categories
- `GET /cart` - Get shopping cart
- `POST /cart/add` - Add item to cart
- `GET /orders` - Get user orders

## Environment Configuration

API endpoint is hardcoded to `http://localhost:8080/api` in `src/services/apiService.js`

To change for different environments, update:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

**Port 3000 already in use:**
```powershell
$process = Get-Process -Name node -ErrorAction SilentlyContinue
if ($process) { $process | Stop-Process -Force }
npm start
```

**Cache issues:**
```powershell
npm start -- --reset-cache
```

**Build fails:**
```powershell
rm -r node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. Install dependencies: `npm install`
2. Start development: `npm start`
3. Build for production: `npm run build`
4. Test with Spring Boot backend
