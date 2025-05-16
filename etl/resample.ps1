# PowerShell script to run the daily_resample.py script
Write-Host "Resampling JSON series data to daily frequency..."

# Check if Python is available as python or python3
$pythonCmd = if (Get-Command "python" -ErrorAction SilentlyContinue) { 
    "python" 
} elseif (Get-Command "python3" -ErrorAction SilentlyContinue) {
    "python3"
} elseif (Get-Command "py" -ErrorAction SilentlyContinue) {
    "py"
} else {
    Write-Error "Python not found. Please ensure Python is installed and in your PATH."
    exit 1
}

# Run the daily_resample.py script
& $pythonCmd "$PSScriptRoot\daily_resample.py"

Write-Host "Done! All series files have been updated with daily data." 