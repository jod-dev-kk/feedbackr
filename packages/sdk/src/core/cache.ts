const CACHE_KEY = "fb_ck"; // feedback client key
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export function setCache(clientId: string) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      clientId,
      expiresAt: Date.now() + CACHE_TTL,
    }),
  );
}

export function getCache(clientId: string): boolean {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return false;

    const { clientId: cachedId, expiresAt } = JSON.parse(raw);

    if (cachedId !== clientId) return false; // different clientId
    if (Date.now() > expiresAt) {
      // expired
      localStorage.removeItem(CACHE_KEY);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
