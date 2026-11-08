#!/bin/bash
# Helper script to launch both backend and frontend servers

echo "=========================================================="
echo " Starting Small E-Commerce Management System Servers"
echo "=========================================================="

# Trap SIGINT to kill both background processes on Ctrl+C
trap 'kill $(jobs -p)' EXIT

echo "1. Starting Laravel Backend on http://127.0.0.1:8000..."
(cd backend && php artisan serve --port=8000) &

echo "2. Starting React Vite Frontend on http://localhost:5173..."
(cd frontend && npm run dev) &

echo ""
echo "🚀 Application is running:"
echo "   - Frontend Storefront & Admin: http://localhost:5173"
echo "   - Backend RESTful API:         http://127.0.0.1:8000/api"
echo ""
echo "Press Ctrl+C to stop both servers."

wait
