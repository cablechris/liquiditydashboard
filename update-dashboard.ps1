# Unified Liquidity Dashboard Update Script
# This PowerShell script can be used both for manual updates and setting up scheduled tasks

param(
    [switch]$Schedule,
    [string]$Time = "03:00"
)

$ScriptPath = $MyInvocation.MyCommand.Path
$ScriptDir = Split-Path -Parent $ScriptPath
$NodeScript = Join-Path $ScriptDir "update-dashboard.js"
$TaskName = "LiquidityDashboardUpdate"

# Function to run the update
function Update-Dashboard {
    Write-Host "Starting Liquidity Dashboard update at $(Get-Date)" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green

    # Check if Node.js is installed
    try {
        $nodeVersion = node -v
        Write-Host "Using Node.js $nodeVersion" -ForegroundColor Cyan
    }
    catch {
        Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
        exit 1
    }

    # Check if the update script exists
    if (-not (Test-Path $NodeScript)) {
        Write-Host "ERROR: Cannot find update script at $NodeScript" -ForegroundColor Red
        exit 1
    }

    # Run the update script
    Write-Host "Running update script..." -ForegroundColor Cyan
    node $NodeScript
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nUpdate completed successfully at $(Get-Date)" -ForegroundColor Green
    }
    else {
        Write-Host "`nUpdate process encountered errors. Check logs for details." -ForegroundColor Red
    }
}

# Function to schedule the task
function Schedule-Update {
    Write-Host "Setting up scheduled task for Liquidity Dashboard updates" -ForegroundColor Cyan
    
    # Check if running as administrator
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    $isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Host "ERROR: This script must be run as Administrator to create scheduled tasks" -ForegroundColor Red
        exit 1
    }
    
    # Create the action to run the PowerShell script
    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`"" -WorkingDirectory $ScriptDir
    
    # Set the trigger to run daily at the specified time
    $trigger = New-ScheduledTaskTrigger -Daily -At $Time
    
    # Set the principal to run with highest privileges
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    
    # Set additional settings
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    
    # Create or update the task
    if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
        # Update existing task
        Set-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings
        Write-Host "Updated existing scheduled task: $TaskName" -ForegroundColor Green
    } else {
        # Create new task
        Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description "Updates Liquidity Dashboard data daily"
        Write-Host "Created new scheduled task: $TaskName" -ForegroundColor Green
    }
    
    Write-Host "Task scheduled to run daily at $Time" -ForegroundColor Green
}

# Main script logic
if ($Schedule) {
    Schedule-Update
} else {
    Update-Dashboard
}

# Provide instructions
if (-not $Schedule) {
    Write-Host "`nTo set up automatic daily updates, run this script with the -Schedule parameter:`n"
    Write-Host "    .\update-dashboard.ps1 -Schedule" -ForegroundColor Yellow
    Write-Host "    .\update-dashboard.ps1 -Schedule -Time 04:00" -ForegroundColor Yellow
} 