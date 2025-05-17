// Global type definitions for the Liquidity Dashboard

// Redis client types
declare module 'redis' {
  export function createClient(options?: any): any;
}

// Fix for process.env in client components
declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_URL: string;
    UPDATE_SECRET: string;
    FRED_API_KEY: string;
  }
}

// Fix for image imports
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}