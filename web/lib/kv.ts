import { createClient } from 'redis';

// Create a Redis client with the provided URL
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809'
});

// Connect to Redis (with auto-reconnect)
redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

// Redis client wrapper with KV-like interface
export const kv = {
  async get(key: string) {
    if (!redisClient.isOpen) await redisClient.connect();
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  },
  
  async set(key: string, value: any) {
    if (!redisClient.isOpen) await redisClient.connect();
    await redisClient.set(key, JSON.stringify(value));
    return true;
  },
  
  async del(key: string) {
    if (!redisClient.isOpen) await redisClient.connect();
    await redisClient.del(key);
    return true;
  }
};

export default kv;

// Key names for the KV store
export const KV_KEYS = {
  DASHBOARD: 'dashboard',
  SPARKS: 'sparks',
  SERIES: {
    ON_RRP: 'series:on_rrp',
    RESERVES: 'series:reserves',
    MOVE: 'series:move',
    SRF: 'series:srf',
    BILL_SHARE: 'series:bill_share',
    TAIL_BP: 'series:tail_bp',
    FUNDING: 'series:funding'
  },
  AUCTIONS: 'auctions',
  LAST_UPDATED: 'last_updated'
}; 