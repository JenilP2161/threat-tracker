// src/middleware/rateLimit.ts

const ipRequestCounts = new Map<string, { count: number; lastRequestTime: number }>();

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 10;

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const requestLog = ipRequestCounts.get(ip);

  if (!requestLog) {
    ipRequestCounts.set(ip, { count: 1, lastRequestTime: now });
    return true;
  }

  const timeSinceLastRequest = (now - requestLog.lastRequestTime) / 1000;

  if (timeSinceLastRequest > WINDOW_SIZE_IN_SECONDS) {
    ipRequestCounts.set(ip, { count: 1, lastRequestTime: now });
    return true;
  }

  if (requestLog.count < MAX_REQUESTS) {
    requestLog.count += 1;
    ipRequestCounts.set(ip, requestLog);
    return true;
  }

  return false; // Rate limit exceeded
}
