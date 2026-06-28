import Redis from "ioredis";

let redis = null;
const memoryCache = new Map();

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
  });

  redis.on("error", () => {
    redis = null;
  });
}

const now = () => Date.now();

export const getCache = async (key) => {
  if (redis) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
};

export const setCache = async (key, value, ttlSeconds = 600) => {
  if (redis) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return;
  }

  memoryCache.set(key, {
    value,
    expiresAt: now() + ttlSeconds * 1000,
  });
};

export const deleteCache = async (...keys) => {
  if (redis) {
    if (keys.length > 0) await redis.del(keys);
    return;
  }

  keys.forEach((key) => memoryCache.delete(key));
};

export const deleteByPrefix = async (prefix) => {
  if (redis) {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length > 0) await redis.del(keys);
    return;
  }

  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) memoryCache.delete(key);
  }
};
