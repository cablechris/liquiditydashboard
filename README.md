# Liquidity Dashboard v0.1

A static, auto-updating website that visualizes the five critical USD-liquidity gauges that historically precede Federal Reserve policy pivots.

## High-level architecture

```
GitHub repo
├── etl/               # Python fetch + clean
├── web/               # Next.js 14 App Router front-end
└── .github/workflows  # CI: daily ETL + commit
```

## Data sources

| Metric        | Endpoint                                             | Freq                           |
| ------------- | ---------------------------------------------------- | ------------------------------ |
| ON‑RRP        | FRED `RRPONTSYD`                                     | Daily                          |
| Reserves      | FRED `WRBWFRBL`                                      | Weekly (latest obs used daily) |
| MOVE          | HTML scrape ‑ FT.com summary page                    | 15 min delayed                 |
| SRF           | NY Fed CSV API                                       | Daily                          |
| Auction table | TreasuryDirect HTML table of 20 most‑recent auctions | Daily                          |

## Local development

```bash
# Install Python dependencies
pip install -r etl/requirements.txt

# Run the ETL process
make etl

# Install JavaScript dependencies
cd web && npm install

# Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard. 