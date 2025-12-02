class RateLimiter {
  constructor(options = {}) {
    this.interval = options.interval || 60 * 1000; 
    this.uniqueTokenPerInterval = options.uniqueTokenPerInterval || 500;
    this.store = new Map();
  }

  async check(key, limit) {
    const now = Date.now();
    const windowStart = now - this.interval;

    this.cleanup(windowStart);

    const userRequests = this.store.get(key) || [];
    
    userRequests.push(now);
    this.store.set(key, userRequests);

    const requestsInWindow = userRequests.filter(time => time > windowStart);
    return requestsInWindow.length > limit;
  }

  cleanup(windowStart) {
    for (const [key, requests] of this.store.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      
      if (validRequests.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, validRequests);
      }
    }

    if (this.store.size > this.uniqueTokenPerInterval) {
      const keys = Array.from(this.store.keys());
      const excessKeys = keys.slice(0, this.store.size - this.uniqueTokenPerInterval);
      excessKeys.forEach(key => this.store.delete(key));
    }
  }

  resetKey(key) {
    this.store.delete(key);
  }

  getRemainingRequests(key, limit) {
    const now = Date.now();
    const windowStart = now - this.interval;
    const userRequests = this.store.get(key) || [];
    const requestsInWindow = userRequests.filter(time => time > windowStart);
    
    return Math.max(0, limit - requestsInWindow.length);
  }
}

let rateLimiterInstance = null;

export default function rateLimit(options = {}) {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RateLimiter(options);
  }
  
  return rateLimiterInstance;
}