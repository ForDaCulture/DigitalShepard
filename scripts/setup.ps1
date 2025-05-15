# Digital Shepherd Development Environment Setup
# PowerShell Script

Write-Host "🛡️ Setting up Digital Shepherd development environment..." -ForegroundColor Green

# Check Prerequisites
function Check-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Verify required tools
$requirements = @{
    "docker" = "Docker"
    "node" = "Node.js"
    "python" = "Python"
    "git" = "Git"
}

$missing = @()
foreach ($req in $requirements.Keys) {
    if (-not (Check-Command $req)) {
        $missing += $requirements[$req]
    }
}

if ($missing.Count -gt 0) {
    Write-Host "❌ Missing required tools: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "Please install them and run this script again."
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# Setup Backend
Write-Host "🔧 Setting up backend..." -ForegroundColor Blue
Set-Location backend
python -m venv venv
./venv/Scripts/Activate.ps1
pip install -r requirements.txt
Set-Location ..

# Setup Frontend
Write-Host "🎨 Setting up frontend..." -ForegroundColor Blue
Set-Location frontend
npm install
Set-Location ..

# Build Docker containers
Write-Host "🐳 Building Docker containers..." -ForegroundColor Blue
docker-compose build

Write-Host "✅ Setup complete! Run 'docker-compose up' to start the application." -ForegroundColor Green
Write-Host @"

🌐 Access the applications at:
   Frontend: http://localhost:3000
   Backend API: http://localhost:8000/docs
   Metrics: http://localhost:9090

📚 Documentation:
   - README.md for general guidance
   - /docs for API documentation
   - /frontend/README.md for frontend details

"@ -ForegroundColor Yellow 