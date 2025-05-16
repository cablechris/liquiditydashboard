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
