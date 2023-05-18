import { Redis } from '@upstash/redis';

export const db = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});
