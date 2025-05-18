# Liquidity Dashboard Setup Guide

This document provides comprehensive setup instructions for the Federal Reserve Liquidity Dashboard.

## Local Development Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v7 or later)
- PowerShell (for Windows users)

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/liquidity-dashboard.git
   cd liquidity-dashboard
   ```

2. Install dependencies:
   ```
   cd web
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the dashboard at http://localhost:3000

## Data Update Configuration

The dashboard requires regular data updates to display the latest financial metrics. You have several options for setting this up:

### Option 1: Manual Updates

Run the update script whenever you want to refresh the data:

```
node update-dashboard.js
```

Or use the PowerShell script:

```
.\update-dashboard.ps1
```

### Option 2: Scheduled Updates with Windows Task Scheduler

The dashboard includes a PowerShell script that can automatically set up a scheduled task:

1. Open PowerShell as Administrator
2. Run the scheduling script:
   ```
   .\update-dashboard.ps1 -Schedule
   ```
3. This will create a task that runs daily at 3:00 AM. To customize the time:
   ```
   .\update-dashboard.ps1 -Schedule -Time "04:00"
   ```

### Option 3: GitHub Actions (For Deployed Environments)

If you've pushed your repository to GitHub, you can use the included workflow to automatically update data:

1. The `.github/workflows/update-dashboard-data.yml` file contains the workflow configuration
2. It runs daily at 3:00 AM UTC
3. No additional setup required if you're using the repository as is

## Deployment Options

### Vercel Deployment

The dashboard is configured for easy deployment with Vercel:

1. Connect your GitHub repository to Vercel
2. The site will automatically build and deploy

### Environment Variables

If you need to use the FRED API for additional data sources, set up the following environment variable in your deployment platform:

- `FRED_API_KEY`: Your API key from Federal Reserve Economic Data

You can obtain a free FRED API key from https://fredaccount.stlouisfed.org/

## Additional Configuration

### Data Backup Strategy

Instead of keeping `.bak` files, the dashboard now uses a more structured approach for backing up data:

1. The daily update process archives the previous day's data in `web/public/series/archive/`
2. Each archive is named with the date: `move-2025-05-18.json`
3. This allows for easier recovery if needed

### Troubleshooting

If you encounter issues with the dashboard:

1. Check the logs in `web/logs/` directory
2. Ensure your system date is correct (future dates can cause validation errors)
3. Verify that all data files in `web/public/series/` are valid JSON
4. If a data source fails, the dashboard will use fallback data with realistic values

## Migrating from Earlier Versions

If you're upgrading from an earlier version of the dashboard:

1. Back up your existing data files in `web/public/series/`
2. Delete any `.bak` files as they're no longer needed
3. Replace any usage of `update-data.js`, `update-all-data.ps1`, or `schedule-data-update.ps1` with the new unified scripts
4. Legacy Python ETL scripts in the `etl/` directory are no longer recommended; use the Node.js scripts in `web/lib/` instead 