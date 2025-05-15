# Setup script for Digital Shepherd

Write-Host "🚀 Setting up Digital Shepherd..." -ForegroundColor Cyan

# Frontend Setup
Write-Host "📦 Setting up frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm install -D @tailwindcss/forms @headlessui/react @tailwindcss/typography @tailwindcss/aspect-ratio
Set-Location ..

# Backend Setup
Write-Host "🐍 Setting up Python virtual environment..." -ForegroundColor Yellow
Set-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1

Write-Host "🔧 Upgrading pip and installing build dependencies..." -ForegroundColor Yellow
python -m pip install --upgrade pip setuptools wheel build

Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
python -m pip install --no-cache-dir -r requirements.txt
python -m pip install slowapi prometheus-client sentry-sdk
python -m pip freeze > requirements.txt

# Return to root
Set-Location ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host @"

🎉 Digital Shepherd is ready!

To start development:
1. Frontend: cd frontend && npm run dev
2. Backend: cd backend && .\venv\Scripts\activate && uvicorn app.main:app --reload

Happy coding! 🚀
"@ -ForegroundColor Cyan 