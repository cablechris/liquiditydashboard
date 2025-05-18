@echo off
echo Starting Federal Reserve Liquidity Dashboard...
echo.

REM Check if the update flag is specified
if "%1"=="-update" (
    echo Running data update first...
    node update-dashboard.js
    if errorlevel 1 (
        echo Error updating data. Check logs for details.
        pause
        exit /b 1
    )
    echo Data update completed successfully.
    echo.
)

REM Run the development server
cd web
echo Starting Next.js development server...
npm run dev 