#!/bin/bash

echo "Starting Chatbot Platform..."
echo ""

echo "[1/3] Starting Backend..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

sleep 10

echo "[2/3] Installing Frontend Dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
fi

echo "[3/3] Starting Frontend..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "Chatbot Platform is running!"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
