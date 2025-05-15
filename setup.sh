#!/bin/bash

# Setup script for Digital Shepherd

echo -e "\033[36m🚀 Setting up Digital Shepherd...\033[0m"

# Frontend Setup
echo -e "\033[33m📦 Setting up frontend dependencies...\033[0m"
cd frontend
npm install
npm install -D @tailwindcss/forms @headlessui/react @tailwindcss/typography @tailwindcss/aspect-ratio
cd ..

# Backend Setup
echo -e "\033[33m🐍 Setting up Python virtual environment...\033[0m"
cd backend
python3 -m venv venv
source venv/bin/activate

echo -e "\033[33m🔧 Upgrading pip and installing build dependencies...\033[0m"
python3 -m pip install --upgrade pip setuptools wheel build

echo -e "\033[33m📦 Installing Python dependencies...\033[0m"
python3 -m pip install --no-cache-dir -r requirements.txt
python3 -m pip install slowapi prometheus-client sentry-sdk
python3 -m pip freeze > requirements.txt

# Return to root
cd ..

echo -e "\033[32m✅ Setup complete!\033[0m"
echo -e "\033[36m
🎉 Digital Shepherd is ready!

To start development:
1. Frontend: cd frontend && npm run dev
2. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload

Happy coding! 🚀
\033[0m" 