// Define a RedisClientType interface to avoid needing the direct import
interface RedisClientType {
  isOpen: boolean;
  connect(): Promise<unknown>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<unknown>;
  del(key: string): Promise<unknown>;
  on(event: string, callback: (error: Error) => void): void;
}

// Mock KV implementation as fallback
const mockKv = {
  async get(key: string) {
    console.warn('Using mock KV implementation - Redis not available');
    return null;
  },
  async set(key: string, value: any) {
    console.warn('Using mock KV implementation - Redis not available');
    return true;
  },
  async del(key: string) {
    console.warn('Using mock KV implementation - Redis not available');
    return true;
  }
};

// Default to mock implementation
let redisClient: RedisClientType | null = null;
let kv = mockKv;

// Only try to use Redis on the server side, not during build or client render
if (typeof window === 'undefined') {
  try {
    // Dynamic import to avoid issues during build
    import('redis').then((redis) => {
      const { createClient } = redis;
      
      redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://default:7juo4GJt3KdsAZ14CoxdGEi2ZMxDcpnP@redis-14809.c74.us-east-1-4.ec2.redns.redis-cloud.com:14809'
      }) as RedisClientType;

      // Connect to Redis (with auto-reconnect)
      redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

      // Redis client wrapper with KV-like interface
      kv = {
        async get(key: string) {
          try {
            if (redisClient && !redisClient.isOpen) await redisClient.connect();
            const value = redisClient ? await redisClient.get(key) : null;
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Redis get error:', error);
            return null;
          }
        },
        
        async set(key: string, value: any) {
          try {
            if (redisClient && !redisClient.isOpen) await redisClient.connect();
            if (redisClient) await redisClient.set(key, JSON.stringify(value));
            return true;
          } catch (error) {
            console.error('Redis set error:', error);
            return false;
          }
        },
        
        async del(key: string) {
          try {
            if (redisClient && !redisClient.isOpen) await redisClient.connect();
            if (redisClient) await redisClient.del(key);
            return true;
          } catch (error) {
            console.error('Redis del error:', error);
            return false;
          }
        }
      };
    }).catch(error => {
      console.error('Failed to import Redis module:', error);
    });
  } catch (error) {
    console.error('Failed to initialize Redis client, using mock implementation:', error);
  }
}

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