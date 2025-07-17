/**
 * Cache Manager for API responses
 * Provides in-memory caching with TTL (Time To Live) support
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  key?: string // Custom cache key
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes default

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    this.cache.set(key, entry)
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      totalMemory: this.calculateMemoryUsage()
    }
  }

  /**
   * Calculate approximate memory usage
   */
  private calculateMemoryUsage(): string {
    let totalSize = 0
    
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2 // String characters are 2 bytes each
      totalSize += JSON.stringify(entry).length * 2
    }
    
    return `${(totalSize / 1024).toFixed(2)} KB`
  }

  /**
   * Create cache key from URL and parameters
   */
  createKey(url: string, params?: any): string {
    const baseKey = url.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '_')
    
    if (params) {
      const paramString = JSON.stringify(params)
      return `${baseKey}_${btoa(paramString)}`
    }
    
    return baseKey
  }
}

// Cache TTL configurations for different data types
export const CACHE_TTL = {
  DASHBOARD_STATS: 2 * 60 * 1000,     // 2 minutes
  BEVERAGES: 10 * 60 * 1000,          // 10 minutes
  STOCKS: 30 * 1000,                  // 30 seconds
  MOVEMENTS: 1 * 60 * 1000,           // 1 minute
  USERS: 15 * 60 * 1000,              // 15 minutes
  LOTS: 5 * 60 * 1000,                // 5 minutes
  ANALYTICS: 5 * 60 * 1000,           // 5 minutes
  PROFILE: 30 * 60 * 1000,            // 30 minutes
} as const

export const cacheManager = new CacheManager()

setInterval(() => {
  cacheManager.clearExpired()
}, 5 * 60 * 1000)

/**
 * Decorator for caching API responses
 */
export function withCache<T>(
  apiCall: () => Promise<T>,
  cacheKey: string,
  options: CacheOptions = {}
): Promise<T> {
  const ttl = options.ttl || CACHE_TTL.DASHBOARD_STATS
  const key = options.key || cacheKey

  // Try to get from cache first
  const cachedData = cacheManager.get<T>(key)
  if (cachedData) {
    return Promise.resolve(cachedData)
  }

  return apiCall().then(data => {
    cacheManager.set(key, data, ttl)
    return data
  })
}

/**
 * Invalidate cache entries by pattern
 */
export function invalidateCache(pattern: string): void {
  const keys = cacheManager.getStats().keys
  
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cacheManager.delete(key)
    }
  })
}

/**
 * Cache invalidation hooks for different actions
 */
export const cacheInvalidation = {
  onBeverageChange: () => {
    invalidateCache('beverages')
    invalidateCache('dashboard')
    invalidateCache('stocks')
  },

  onStockMovement: () => {
    invalidateCache('stocks')
    invalidateCache('movements')
    invalidateCache('dashboard')
    invalidateCache('analytics')
  },

  onLotChange: () => {
    invalidateCache('lots')
    invalidateCache('stocks')
    invalidateCache('dashboard')
  },

  onUserChange: () => {
    invalidateCache('users')
    invalidateCache('dashboard')
  },

  clearAll: () => {
    cacheManager.clear()
  }
}
