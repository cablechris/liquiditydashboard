@echo off
:: Liquidity Dashboard Data Update Script
:: This script updates all data sources for the Liquidity Dashboard
:: Will output logs to a file in the logs directory

:: Set variables
set TIMESTAMP=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set LOGFILE=web\logs\dashboard_update_%TIMESTAMP%.log

echo ========================================= >> %LOGFILE%
echo Starting Liquidity Dashboard data update at %date% %time% >> %LOGFILE%
echo ========================================= >> %LOGFILE%

echo Starting Liquidity Dashboard data update at %date% %time%
cd /d %~dp0\web
echo Working directory: %CD% >> ..\%LOGFILE%

echo Running data update script... >> ..\%LOGFILE%
node lib/fetch-real-data.js >> ..\%LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Data update failed with error code %ERRORLEVEL% >> ..\%LOGFILE%
  echo ERROR: Data update failed with error code %ERRORLEVEL%
) else (
  echo Data update completed successfully >> ..\%LOGFILE%
  echo Data update completed successfully
)

echo ========================================= >> ..\%LOGFILE%
echo Update finished at %date% %time% >> ..\%LOGFILE%
echo ========================================= >> ..\%LOGFILE%

echo Update finished at %date% %time%

echo Starting dashboard data update process...
echo %date% %time% > logs\update-log.txt

cd web

echo Updating MOVE index data...
node lib/fetch-move-data.js >> ..\logs\update-log.txt 2>&1
if %errorlevel% neq 0 (
  echo Error updating MOVE index data. See logs for details. >> ..\logs\update-log.txt
) else (
  echo MOVE index data updated successfully. >> ..\logs\update-log.txt
)

echo Updating SRF data...
node lib/fetch-srf-data.js >> ..\logs\update-log.txt 2>&1
if %errorlevel% neq 0 (
  echo Error updating SRF data. See logs for details. >> ..\logs\update-log.txt
) else (
  echo SRF data updated successfully. >> ..\logs\update-log.txt
)

echo Updating Treasury funding data...
node lib/fetch-bill-share-data.js >> ..\logs\update-log.txt 2>&1
if %errorlevel% neq 0 (
  echo Error updating Treasury funding data. See logs for details. >> ..\logs\update-log.txt
) else (
  echo Treasury funding data updated successfully. >> ..\logs\update-log.txt
)

echo %date% %time% Update completed >> ..\logs\update-log.txt
echo Dashboard data update completed.
cd ..

echo ========================================= >> %LOGFILE%
echo Update finished at %date% %time% >> %LOGFILE%
echo ========================================= >> %LOGFILE% 