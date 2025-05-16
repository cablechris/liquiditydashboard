# USD Liquidity Dashboard

A real-time dashboard tracking critical USD-liquidity gauges that historically precede Federal Reserve policy pivots.

## Features

- **ON-RRP Balance**: Overnight Reverse Repo facility usage with directional delta and days-to-empty calculation
- **Reserve Balances**: Bank reserves held at the Fed with week-over-week change
- **MOVE Index**: Treasury market volatility with bullet chart showing gap to floor
- **SRF Take-up**: Standing Repo Facility usage with 7-day moving average
- **Treasury Funding Pressure**: Bill auction share and tail pricing metrics
- **Liquidity Thermometer**: Aggregate view of all metrics' status

## Project Structure

- `/etl` - Python scripts to fetch data from FRED, FT.com, NY Fed, TreasuryDirect
- `/web` - Next.js frontend with Tailwind CSS styling
- `/data` - Historical data storage (parquet format)
- `/.github/workflows` - GitHub Actions for daily data refresh

## Technical Stack

- **Backend**: Python, pandas, requests, BeautifulSoup
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Data Visualization**: Custom SVG charts, sparklines, and bullet charts
- **Deployment**: Vercel, GitHub Actions

## Installation & Usage

### Running locally

1. Clone the repository
   ```
   git clone https://github.com/cablechris/liquiditydashboard.git
   cd liquiditydashboard
   ```

2. Install frontend dependencies and run development server
   ```
   cd web
   npm install
   npm run dev
   ```

3. Run ETL script (requires FRED API key)
   ```
   cd etl
   pip install -r requirements.txt
   FRED_API_KEY=your_api_key python fetch_data.py
   ```

### Environment Variables

- `FRED_API_KEY`: API key for Federal Reserve Economic Data

## Status Thresholds

The dashboard uses a red/amber/green system based on these thresholds:

- **ON-RRP**: <$50bn (red), <$100bn (amber), >$100bn (green)
- **Reserves**: <$2.5tn (red), <$3.0tn (amber), >$3.0tn (green)
- **MOVE**: >140 (red), >120 (amber), <120 (green)
- **SRF**: >$100bn (red), >$25bn (amber), <$25bn (green)
- **Treasury Funding**: Bill share >60% AND tails >4bp (red), Bill share >60% OR tails >4bp (amber), otherwise (green)

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Daily Data Updates

The dashboard automatically updates daily through a GitHub Actions workflow. To ensure the updates work correctly:

1. You need to configure a GitHub secret named `FRED_API_KEY` with your Federal Reserve Economic Data (FRED) API key.
2. The workflow will run automatically at a scheduled time (currently set to 12:15 AM UTC daily).
3. The ETL process fetches the latest data, processes it, and updates the dashboard's data files.

## Setting Up the FRED API Key

To set up the FRED API key:

1. Obtain a FRED API key from the [Federal Reserve Bank of St. Louis FRED API](https://fred.stlouisfed.org/docs/api/api_key.html)
2. In your GitHub repository:
   - Go to **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - Name: `FRED_API_KEY`
   - Value: Your FRED API key
   - Click **Add secret**

## Local Development

### Requirements

- Node.js 14+
- Python 3.8+

### Setup

1. Clone the repository
2. Install web dependencies: `cd web && npm install`
3. Install ETL dependencies: `pip install -r etl/requirements.txt`
4. Run the development server: `cd web && npm run dev`

### ETL Process

To run the ETL process locally:

1. Set your FRED API key as an environment variable: `$env:FRED_API_KEY="your-api-key"`
2. Run the ETL script: `python etl/fetch_data.py`

## Online Deployment

The project is configured for automatic deployment with Vercel:

1. Connect your GitHub repository to Vercel
2. The site will automatically build and deploy when you push changes
3. Data will be refreshed daily through the GitHub Actions workflow
