const NodeCache = require('node-cache');
const cache = new NodeCache({
  stdTTL: 300, // Default TTL in seconds
  checkperiod: 600 // Check every 600 seconds
});

function getCache(key) {
  return cache.get(key);
}

function setCache(key, value, ttl = 300) {
  cache.set(key, value, ttl);
}

function delCache(key) {
  cache.del(key);
}

module.exports = {
  getCache,
  setCache,
  delCache
};