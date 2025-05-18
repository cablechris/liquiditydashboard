# PowerShell script to create a scheduled task for Liquidity Dashboard data updates
# Run this script as Administrator to create the task

$scriptPath = Join-Path -Path $PSScriptRoot -ChildPath "update-dashboard-data.bat"
$taskName = "LiquidityDashboardUpdate"
$description = "Updates real Federal Reserve data for the Liquidity Dashboard"

# Get full path to the script
$fullScriptPath = (Get-Item $scriptPath).FullName

# Create the task action (run the batch file)
$action = New-ScheduledTaskAction -Execute $fullScriptPath

# Set the task trigger (daily at 3:00 AM)
$trigger = New-ScheduledTaskTrigger -Daily -At 3AM

# Set task settings (allow task to run on demand, stop if running longer than 30 minutes)
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

# Create the task (will prompt for credentials)
Register-ScheduledTask -TaskName $taskName -Description $description -Action $action -Trigger $trigger -Settings $settings

Write-Host "Scheduled task '$taskName' has been created. It will run daily at 3:00 AM." -ForegroundColor Green
Write-Host "You can customize it further in Task Scheduler if needed." 