@echo off
REM E-Commerce Application Startup Script
REM This script helps you start both backend and frontend correctly

echo ===============================================
echo E-Commerce Platform - Application Startup
echo ===============================================
echo.

REM Check if we're in the right directory
if not exist "pom.xml" (
    echo Error: Please run this script from the spring-boot-ecommerce root directory
    echo Current directory: %cd%
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend directory not found
    echo Please ensure you're in the spring-boot-ecommerce root directory
    pause
    exit /b 1
)

echo.
echo Step 1: Starting Backend (Spring Boot on port 8080)
echo.
echo Open a NEW PowerShell terminal and run:
echo   cd %cd%
echo   mvn spring-boot:run
echo.
echo Then wait for message: "Tomcat started on port(s): 8080"
echo.

echo Step 2: Starting Frontend (React on port 3000)
echo.
echo Open ANOTHER NEW PowerShell terminal and run:
echo   cd %cd%\frontend
echo   npm start
echo.
echo Then wait for message: "webpack compiled successfully"
echo.

echo ===============================================
echo Important Notes:
echo ===============================================
echo.
echo 1. Backend will run on:
echo    http://localhost:8080
echo    API endpoints: http://localhost:8080/api/...
echo.
echo 2. Frontend will run on:
echo    http://localhost:3000
echo    API calls go to: http://localhost:8080/api/...
echo.
echo 3. Check the configuration:
echo    - Frontend: frontend\.env.local
echo      REACT_APP_API_URL=http://localhost:8080/api
echo.
echo 4. Database:
echo    - Using embedded H2 database (in-memory)
echo    - No setup required
echo.
echo 5. Stripe (Test Mode):
echo    - Test Card: 4242 4242 4242 4242
echo    - Expiry: 12/25, CVC: 123
echo.

echo ===============================================
echo Testing the Payment Flow:
echo ===============================================
echo.
echo 1. Open: http://localhost:3000
echo 2. Add a product to cart
echo 3. Go to Checkout
echo 4. Fill in address details
echo 5. Click "Continue to Payment"
echo 6. Enter test card details
echo 7. Click "Pay $X.XX"
echo 8. Verify success message
echo.

echo ===============================================
echo Troubleshooting:
echo ===============================================
echo.
echo If you see "403 Forbidden" error:
echo   - Make sure backend is running (mvn spring-boot:run)
echo   - Check frontend .env.local has correct REACT_APP_API_URL
echo   - Clear browser cache (Ctrl+Shift+R)
echo   - Restart npm (Ctrl+C then npm start)
echo.
echo If you see "Cannot connect to server":
echo   - Backend is not running
echo   - Start backend: mvn spring-boot:run
echo   - Wait for "Tomcat started on port(s): 8080"
echo.
echo If you see Stripe errors:
echo   - Verify .env.local has REACT_APP_STRIPE_PUBLIC_KEY
echo   - Use test key: pk_test_...
echo   - Use test card: 4242 4242 4242 4242
echo.

echo ===============================================
echo Press any key to continue...
pause
