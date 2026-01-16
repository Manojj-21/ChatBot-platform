@echo off
echo Starting Chatbot Platform...
echo.

echo [1/3] Starting Backend...
cd backend
start cmd /k "mvn spring-boot:run"
cd ..

timeout /t 10

echo [2/3] Installing Frontend Dependencies...
cd frontend
if not exist node_modules (
    echo Installing npm packages...
    call npm install
)

echo [3/3] Starting Frontend...
start cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo Chatbot Platform is starting!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit...
pause >nul
