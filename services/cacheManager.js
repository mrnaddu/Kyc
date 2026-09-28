/**
 * Production Cache Management Service
 * Dual-layer caching (High-speed In-Memory + Persistent Disk Store)
 * Stores authentic Karnataka ePDS beneficiary records with live invalidation,
 * TTL management, and real-time KYC status synchronization.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const CACHE_FILE = path.join(DATA_DIR, "rationCardCache.json");

// Default Time-To-Live: 30 minutes (in milliseconds)
const DEFAULT_TTL_MS = (parseInt(process.env.CACHE_TTL_MINUTES, 10) || 30) * 60 * 1000;

// In-Memory Cache Store: Map<rcNumber, CacheEntry>
const memoryCache = new Map();

// Initialize on service load
function initCache() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        for (const [key, value] of Object.entries(parsed)) {
          memoryCache.set(key, value);
        }
        console.log(`[Cache Manager] Loaded ${memoryCache.size} persistent Ration Card records from disk.`);
      }
    }
  } catch (err) {
    console.warn("[Cache Manager] Failed to load cache from disk:", err.message);
  }
}

// Persist in-memory cache to disk asynchronously
function persistToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const obj = {};
    for (const [key, value] of memoryCache.entries()) {
      obj[key] = value;
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (err) {
    console.error("[Cache Manager] Failed to persist cache to disk:", err.message);
  }
}

/**
 * Retrieve a cached Ration Card entry
 * @param {string} rcNumber 12-digit card number
 * @returns {object} { hit: boolean, isStale: boolean, ageSeconds: number, lastSynced: string, data: object }
 */
function getCard(rcNumber) {
  if (!rcNumber) return { hit: false };
  const cleanRc = rcNumber.trim();

  if (!memoryCache.has(cleanRc)) {
    return { hit: false };
  }

  const entry = memoryCache.get(cleanRc);
  const now = Date.now();

  // Check TTL expiry
  if (entry.expiresAt && now > entry.expiresAt) {
    console.log(`[Cache Manager] Cache expired for RC: ${cleanRc} (TTL: ${DEFAULT_TTL_MS / 60000} mins)`);
    return { hit: false, isStale: true };
  }

  const ageSeconds = Math.max(0, Math.round((now - entry.cachedAt) / 1000));

  return {
    hit: true,
    isStale: false,
    ageSeconds,
    lastSynced: entry.lastSynced,
    data: entry.data
  };
}

/**
 * Store actual live data returned from ahara.karnataka.gov.in
 * @param {string} rcNumber 12-digit card number
 * @param {object} liveData Scraped real data payload
 * @param {number} customTtlMs Optional custom TTL
 */
function setCard(rcNumber, liveData, customTtlMs = DEFAULT_TTL_MS) {
  if (!rcNumber || !liveData) return false;
  const cleanRc = rcNumber.trim();
  const now = Date.now();

  // Preserve verified member status across live refreshes
  if (memoryCache.has(cleanRc)) {
    const existing = memoryCache.get(cleanRc);
    if (existing && existing.data && Array.isArray(existing.data.members) && Array.isArray(liveData.members)) {
      const verifiedMap = new Map();
      existing.data.members.forEach(m => {
        if (m.ekyc === "VERIFIED" || m.isKycComplete) {
          verifiedMap.set(m.id, {
            ekyc: m.ekyc,
            isKycComplete: m.isKycComplete,
            verifiedAt: m.verifiedAt,
            kycReferenceId: m.kycReferenceId
          });
        }
      });
      liveData.members.forEach(m => {
        if (verifiedMap.has(m.id)) {
          Object.assign(m, verifiedMap.get(m.id));
        }
      });
    }
  }

  const entry = {
    rcNumber: cleanRc,
    cachedAt: now,
    lastSynced: new Date(now).toISOString(),
    expiresAt: now + customTtlMs,
    data: liveData
  };

  memoryCache.set(cleanRc, entry);
  persistToDisk();

  console.log(`[Cache Manager] Saved live data to cache for RC: ${cleanRc} (Expires in ${customTtlMs / 60000} mins)`);
  return true;
}

/**
 * Real-time update of family member's verified e-KYC status
 * Synchronizes the cache so future views reflect official completion.
 */
function updateMemberKycStatus(rcNumber, memberId, certPayload) {
  if (!rcNumber || !memberId) return false;
  const cleanRc = rcNumber.trim();

  if (!memoryCache.has(cleanRc)) return false;

  const entry = memoryCache.get(cleanRc);
  if (!entry.data || !Array.isArray(entry.data.members)) return false;

  const member = entry.data.members.find(m => m.id === memberId);
  if (member) {
    member.ekyc = "VERIFIED";
    member.isKycComplete = true;
    member.verifiedAt = certPayload.verifiedAt || new Date().toISOString();
    member.kycReferenceId = certPayload.kycReferenceId;

    entry.lastSynced = new Date().toISOString();
    memoryCache.set(cleanRc, entry);
    persistToDisk();

    console.log(`[Cache Manager] Updated e-KYC status to VERIFIED for member ${member.nameEn} (${cleanRc})`);
    return true;
  }

  return false;
}

/**
 * Invalidate cache for a specific card to force a live scrape
 */
function invalidateCard(rcNumber) {
  if (!rcNumber) return false;
  const cleanRc = rcNumber.trim();
  if (memoryCache.has(cleanRc)) {
    memoryCache.delete(cleanRc);
    persistToDisk();
    console.log(`[Cache Manager] Invalidate cache for RC: ${cleanRc}`);
    return true;
  }
  return false;
}

// Initialize on module load
initCache();

module.exports = {
  getCard,
  setCard,
  updateMemberKycStatus,
  invalidateCard
};
