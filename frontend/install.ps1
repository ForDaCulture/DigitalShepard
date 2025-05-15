try {
    # Check if yarn is available
    $yarnVersion = yarn --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Installing with Yarn..."
        yarn install --network-timeout 100000
    } else {
        Write-Host "Yarn not found, trying npm..."
        npm install --no-audit --no-fund
    }
} catch {
    Write-Host "Error during installation: $_"
    exit 1
} 