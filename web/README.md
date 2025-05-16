# Liquidity Dashboard

A real-time dashboard displaying Federal Reserve liquidity metrics.

## Setup and Configuration

### Redis Storage Setup

This dashboard uses Redis Cloud to maintain up-to-date data from the FRED API. The connection is already configured with the URL:

```
redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809
```

### Environment Variables

Set up the following environment variables in your Vercel project:

- `FRED_API_KEY`: Your API key from the Federal Reserve Economic Data (FRED) service
- `REDIS_URL`: Already configured in vercel.json
- `UPDATE_SECRET`: A secret token to protect your update API endpoint

### Daily Updates

The dashboard will automatically update daily via a cron job that fetches the latest data from FRED.

To manually trigger an update, visit:
```
https://yourdomain.com/api/update-data?secret=YOUR_UPDATE_SECRET
```

## Development

```bash
pip install -r etl/requirements.txt
make etl
cd web && npm i && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). 

## Build

```
npm run build
```

## Deploy

```
vercel --prod
``` 