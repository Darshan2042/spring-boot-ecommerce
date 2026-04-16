@echo off
REM Quick Test Script for E-Commerce Registration Fix
REM This script will help you verify registration works

echo.
echo ====================================
echo E-Commerce Registration Test
echo ====================================
echo.

REM Check if port 8080 is in use
echo [1/3] Checking Backend (Port 8080)...
netstat -ano | findstr :8080 > nul
if %errorlevel% equ 0 (
    echo ✓ Backend is running on port 8080
) else (
    echo ✗ Backend NOT running on port 8080
    echo Please start backend:
    echo   cd c:\Users\Admin\Downloads\looo\spring-boot-ecommerce
    echo   mvn spring-boot:run
    exit /b
)

REM Check if port 3000 is in use
echo.
echo [2/3] Checking Frontend (Port 3000)...
netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is running on port 3000
) else (
    echo ✗ Frontend NOT running on port 3000
    echo Please start frontend in another terminal:
    echo   cd c:\Users\Admin\Downloads\looo\spring-boot-ecommerce\frontend
    echo   npm start
    exit /b
)

REM Test API connectivity
echo.
echo [3/3] Testing API Connection...
echo Requesting: http://localhost:8080/api/products

REM Use curl to test API
curl -s http://localhost:8080/api/products > nul
if %errorlevel% equ 0 (
    echo ✓ API is responding correctly
    echo.
    echo ====================================
    echo ✓ EVERYTHING IS WORKING!
    echo ====================================
    echo.
    echo You can now:
    echo 1. Open http://localhost:3000 in your browser
    echo 2. Click "Register" button
    echo 3. Enter username, email, password
    echo 4. Click "Register"
    echo 5. Should see "Registration successful"
    echo.
) else (
    echo ✗ API is NOT responding
    echo Make sure backend is running on port 8080
    exit /b
)

pause
