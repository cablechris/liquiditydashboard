# Setting Up Daily Data Updates for Liquidity Dashboard

You can set up automated daily data updates using one of these two methods:

## Method 1: Using the PowerShell Script (Recommended)

1. Right-click on `schedule-data-update.ps1` in the root directory
2. Select "Run with PowerShell as Administrator"
3. If prompted, enter your Administrator credentials
4. The script will create a scheduled task named "LiquidityDashboardUpdate" that runs daily at 3:00 AM

## Method 2: Manual Setup in Task Scheduler

If you prefer to set up the task manually:

1. Open Task Scheduler (search for "Task Scheduler" in Windows search)
2. Click "Create Task" in the right Actions panel
3. General tab:
   - Name: LiquidityDashboardUpdate
   - Description: Updates real Federal Reserve data for the Liquidity Dashboard
   - Select "Run whether user is logged on or not" for better reliability
   - Check "Run with highest privileges"

4. Triggers tab:
   - Click "New"
   - Select "Daily"
   - Start time: 3:00:00 AM (or your preferred time)
   - Click OK

5. Actions tab:
   - Click "New"
   - Action: Start a program
   - Program/script: Browse to the `update-dashboard-data.bat` file in the root directory
   - Click OK

6. Conditions tab:
   - Uncheck "Start the task only if the computer is on AC power"
   - Leave other settings at default

7. Settings tab:
   - Set "Stop the task if it runs longer than" to 30 minutes
   - Set "If the running task does not end when requested, force it to stop"
   - Click OK

8. You'll be prompted for your password - enter it and click OK

The task is now scheduled and will run daily to update the dashboard data.

## Verifying the Task

You can manually run the task to verify it works:
1. Find the task in Task Scheduler
2. Right-click and select "Run"
3. Check the `web/logs` directory for the generated log file

If any issues occur, review the log file for error messages. 