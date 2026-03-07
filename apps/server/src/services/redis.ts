import Redis from 'ioredis';
import { config } from '../config.js';

let redisClient: Redis | null = null;
let redisSubscriberClient: Redis | null = null;

function createRedisClient(): Redis {
  return new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true
  });
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = createRedisClient();
  }
  return redisClient;
}

export function getRedisSubscriberClient(): Redis {
  if (!redisSubscriberClient) {
    redisSubscriberClient = createRedisClient();
  }
  return redisSubscriberClient;
}

export async function connectRedis(): Promise<void> {
  const redis = getRedisClient();
  const subscriber = getRedisSubscriberClient();
  if (redis.status === 'wait') {
    await redis.connect();
  }
  if (subscriber.status === 'wait') {
    await subscriber.connect();
  }
}

export async function closeRedis(): Promise<void> {
  const closes: Promise<unknown>[] = [];
  if (redisClient) {
    closes.push(redisClient.quit());
    redisClient = null;
  }
  if (redisSubscriberClient) {
    closes.push(redisSubscriberClient.quit());
    redisSubscriberClient = null;
  }
  if (closes.length > 0) {
    await Promise.all(closes);
  }
}
