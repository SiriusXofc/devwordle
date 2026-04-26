type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "local"
  );
}

async function checkUpstashRateLimit(key: string, limit: number, windowMs: number) {
  if (!upstashUrl || !upstashToken) {
    return null;
  }

  try {
    const response = await fetch(`${upstashUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, windowMs],
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as Array<{ result?: number }>;
    const count = Number(body[0]?.result ?? limit + 1);
    return { ok: count <= limit, remaining: Math.max(limit - count, 0) };
  } catch (error) {
    console.error("[rate-limit]", error);
    return null;
  }
}

function checkMemoryRateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count };
}

export async function checkRateLimit(key: string, limit = 8, windowMs = 60_000) {
  const remote = await checkUpstashRateLimit(key, limit, windowMs);
  return remote ?? checkMemoryRateLimit(key, limit, windowMs);
}
