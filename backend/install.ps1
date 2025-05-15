try {
    # Create virtual environment if it doesn't exist
    if (-not (Test-Path "venv")) {
        Write-Host "Creating virtual environment..."
        python -m venv venv
    }

    # Activate virtual environment
    Write-Host "Activating virtual environment..."
    .\venv\Scripts\Activate.ps1

    # Upgrade pip in a safe way
    Write-Host "Upgrading pip..."
    python -m pip install --upgrade pip

    # Install requirements with fallback to user directory if permission denied
    Write-Host "Installing requirements..."
    try {
        pip install -r requirements.txt
    } catch {
        Write-Host "Trying user installation..."
        pip install --user -r requirements.txt
    }
} catch {
    Write-Host "Error during installation: $_"
    exit 1
} 