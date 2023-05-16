import { Redis } from '@upstash/redis';

export const db = new Redis({
  url: process.env.UPSTASH_REDIT_REST_URL as string,
  token: process.env.USTASH_REDIS_REST_TOKEN as string,
});
