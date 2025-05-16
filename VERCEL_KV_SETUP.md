# Redis Integration for Liquidity Dashboard

This implementation uses Redis Cloud to maintain up-to-date data from the FRED API without relying on GitHub Actions.

## What's Implemented

1. **Redis Cloud Integration**: Connected to Redis Cloud for efficient data storage
2. **API Endpoint**: Created `/api/update-data` endpoint that:
   - Fetches latest data from FRED API
   - Stores data in Redis
   - Is secured with a secret token
3. **Daily CRON Job**: Set up a daily cron job to automatically update data
4. **Fallback Mechanism**: Gracefully falls back to static files if Redis is unavailable
5. **Client-side Loading**: Updated UI components to load data from Redis or static files

## Deployment Steps

### 1. Redis Connection

The dashboard is already configured to use your Redis Cloud instance with the connection string:
```
redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809
```

### 2. Set Environment Variables

In your Vercel project settings, add these environment variables:

- `FRED_API_KEY`: Your API key from FRED
- `REDIS_URL`: Already set in vercel.json (can be overridden in Vercel dashboard if needed)
- `UPDATE_SECRET`: A secure random string to protect the update endpoint

### 3. Deploy to Vercel

```bash
# Deploy production
vercel --prod
```

### 4. Initial Data Population

After deploying, trigger your first data update:

```
https://your-domain.com/api/update-data?secret=YOUR_UPDATE_SECRET
```

## How It Works

1. **Daily Updates**: The cron job runs daily at midnight UTC, fetching fresh data from FRED API
2. **Data Storage**: 
   - Dashboard summary is stored in the `dashboard` key
   - Time series data is stored in separate keys (`series:on_rrp`, `series:reserves`, etc.)
   - A timestamp is stored in `last_updated` key
3. **Data Retrieval**:
   - Front-end first attempts to fetch from Redis
   - Falls back to static JSON files if Redis unavailable

## Benefits

1. **Reliability**: Not dependent on GitHub Actions IP addresses
2. **Speed**: Redis provides extremely fast data access
3. **Simplicity**: Clean separation between data fetching and presentation
4. **Resilience**: Fallback to static files if Redis unavailable
5. **Security**: Protected API endpoint for updates

## Testing in Python

You can test Redis connectivity in Python as shown:

```python
import redis

r = redis.Redis.from_url("redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809")

# Set a value
success = r.set("test_key", "test_value")
# True

# Get a value
result = r.get("test_key")
print(result)
# >>> b'test_value'
```

## Checking Redis Data

You can view and manage your data through the Redis Cloud dashboard. 