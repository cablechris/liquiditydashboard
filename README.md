# Federal Reserve Liquidity Dashboard

A real-time dashboard tracking critical liquidity metrics that historically precede Federal Reserve policy changes. This dashboard visualizes the "plumbing" of the financial system to provide early warning signals of stress that may require policy intervention.

## Key Metrics Tracked

- **MOVE Index** - Treasury market volatility (40-280 range)
- **ON-RRP Facility** - Overnight Reverse Repo usage
- **Bank Reserves** - Reserves held at Federal Reserve
- **Standing Repo Facility (SRF)** - Usage of Fed's lending facility
- **Treasury Funding** - Bill share of issuance and auction demand

## Live Dashboard Features

- Real-time data fetched from primary financial sources
- Historical trend visualization with configurable time periods
- Traffic light indicators showing risk levels for each metric
- Aggregate thermometer view of overall system stress
- Daily automated updates via GitHub Actions

## Technical Architecture

### Data Sources

- **MOVE Index**: Direct web scraping from CNBC, MarketWatch, and Bloomberg
- **SRF**: NY Fed operations website
- **Treasury Data**: U.S. Treasury fiscal data website
- **Bank Reserves & ON-RRP**: FRED API

### Project Structure

- **/web** - Next.js frontend application
  - **/components** - React components for charts and UI elements
  - **/lib** - Data fetching, processing and validation scripts
  - **/public/series** - JSON data files for each metric
  - **/app** - Next.js application pages

- **/.github/workflows** - GitHub Actions for daily data updates
- **/update-dashboard.js** - Unified Node.js script for all data updates
- **/update-dashboard.ps1** - PowerShell script for manual and scheduled updates
- **/SETUP.md** - Comprehensive setup instructions

## Setup and Usage

### Running Locally

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/liquidity-dashboard.git
   cd liquidity-dashboard
   ```

2. **Install dependencies:**
   ```
   cd web
   npm install
   ```

3. **Start the development server:**

   **Windows users:**
   ```
   run.cmd
   ```
   To update data before starting the server:
   ```
   run.cmd -update
   ```

   **Other platforms:**
   ```
   cd web
   npm run dev
   ```

4. **Access the dashboard:**
   Open http://localhost:3000 in your browser

### Setting Up Automatic Data Updates

#### Option 1: GitHub Actions (Recommended)
- The dashboard automatically updates daily at 3:00 AM UTC via GitHub Actions
- No additional setup required if using the repository as is

#### Option 2: Windows Task Scheduler
- Run `update-dashboard.ps1 -Schedule` with administrative privileges
- Or customize the update time: `update-dashboard.ps1 -Schedule -Time "04:00"`

### Manual Data Updates

To manually update all dashboard data:

```
node update-dashboard.js
```

Or use the PowerShell script:

```
./update-dashboard.ps1
```

## Data Management

### Backup and Recovery

The dashboard includes a structured backup system:

```
# Create backups of all data files
node web/lib/data-backup.js

# List all available backups
node web/lib/data-backup.js list

# Restore a specific backup
node web/lib/data-backup.js restore web/public/series/archive/move-2025-05-18.json

# Clean up old .bak files
node web/lib/data-backup.js clean
```

Backups are stored in `web/public/series/archive/` with date-based filenames.

### Cleaning Up Legacy Files

If you've upgraded from a previous version of the dashboard, you can safely clean up legacy files:

```
# Show which files would be removed (dry run mode)
node cleanup-legacy-files.js --dry-run

# Actually remove the files (backs them up to legacy-backup/ first)
node cleanup-legacy-files.js
```

## Data Validation

The dashboard includes robust validation to ensure data integrity:
- Prevents future-dated entries
- Validates value ranges for each metric
- Ensures proper data formatting
- Uses external API references for date validation

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests for:
- Additional metrics
- UI improvements
- Data source enhancements
- Documentation updates

## License

This project is licensed under the MIT License - see the LICENSE file for details.
