@echo off
REM Build and integrate React frontend with Spring Boot

echo.
echo 🔨 Building React Frontend...
echo.

REM Navigate to frontend directory
cd /d "%~dp0frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Build the React app
echo.
echo 🏗️ Building React app...
call npm run build

REM Check if build was successful
if errorlevel 1 (
    echo.
    echo ❌ Build failed!
    pause
    exit /b 1
)

REM Copy built files to Spring Boot
echo.
echo 📁 Copying built files to Spring Boot...

REM Remove old static files
cd /d "%~dp0"
if exist "src\main\resources\static" (
    rmdir /s /q "src\main\resources\static"
)
mkdir "src\main\resources\static"

REM Copy new files
xcopy "frontend\build\*" "src\main\resources\static\" /E /I /Y

echo.
echo ✅ React frontend built and integrated successfully!
echo.
echo 🚀 To start the application, run:
echo    mvn clean compile spring-boot:run
echo.
pause
