#!/bin/bash
# Helper script to launch both backend and frontend servers

echo "=========================================================="
echo " Starting Small E-Commerce Management System Servers"
echo "=========================================================="

# Trap SIGINT to kill both background processes on Ctrl+C
trap 'kill $(jobs -p)' EXIT

echo "1. Starting Laravel Backend on http://127.0.0.1:8000..."
(cd backend && php artisan serve --port=8000) &

echo "2. Starting Next.js Frontend on http://localhost:3000..."
(cd frontend && npm run dev) &

echo ""
echo "🚀 Application is running:"
echo "   - Frontend (Next.js):   http://localhost:3000"
echo "   - Backend (Laravel):    http://127.0.0.1:8000/api"
echo ""
echo "Press Ctrl+C to stop both servers."

wait
