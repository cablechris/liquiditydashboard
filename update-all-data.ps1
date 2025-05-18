# Liquidity Dashboard Update Script
# This PowerShell script updates and validates all data sources

Write-Host "Starting Liquidity Dashboard data update at $(Get-Date)" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Change to web directory
Set-Location -Path ".\web"

# Install required dependencies if not already installed
if (-not (Test-Path -Path ".\node_modules\axios")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install axios cheerio fs-extra
}

# Update MOVE index data
Write-Host "`nUpdating MOVE index data..." -ForegroundColor Cyan
node lib/fetch-move-data.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error updating MOVE index data" -ForegroundColor Red
}

# Update SRF data
Write-Host "`nUpdating SRF data..." -ForegroundColor Cyan
node lib/fetch-srf-data.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error updating SRF data" -ForegroundColor Red
}

# Update Treasury funding data
Write-Host "`nUpdating Treasury bill share data..." -ForegroundColor Cyan
node lib/fetch-bill-share-data.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error updating Treasury bill share data" -ForegroundColor Red
}

# Clean up future-dated entries
Write-Host "`nCleaning up future-dated entries..." -ForegroundColor Cyan
node lib/cleanup-future-dates.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error cleaning up future-dated entries" -ForegroundColor Red
} 

# Validate data
Write-Host "`nValidating data..." -ForegroundColor Cyan
node lib/validate-data.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Data validation failed" -ForegroundColor Red
} else {
    Write-Host "Data validation passed" -ForegroundColor Green
}

Write-Host "`nUpdate process completed at $(Get-Date)" -ForegroundColor Green 