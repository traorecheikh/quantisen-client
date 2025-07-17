import axios, { type AxiosInstance } from 'axios'
import { showApiError } from './../utils/toast.ts'
import { cacheManager, withCache, type CacheOptions } from '../utils/cache'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/examgestionboisson_war_exploded/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else {
      const msg = error.response?.data?.message || error.message || 'Erreur réseau'
      showApiError(msg)
    }
    return Promise.reject(error)
  }
)

/**
 * Enhanced API call with caching support
 */
export async function cachedApiCall<T>(
  apiCall: () => Promise<T>,
  endpoint: string,
  options: CacheOptions = {}
): Promise<T> {
  const cacheKey = cacheManager.createKey(endpoint, options.key)
  return withCache(apiCall, cacheKey, options)
}

/**
 * GET request with caching
 */
export async function cachedGet<T>(url: string, options: CacheOptions = {}): Promise<T> {
  const cacheKey = cacheManager.createKey(url)
  return withCache(() => api.get<T>(url).then((response) => response.data), cacheKey, options)
}

/**
 * POST request that invalidates related cache
 */
export async function cachedPost<T>(
  url: string,
  data: any,
  invalidatePatterns: string[] = []
): Promise<T> {
  const response = await api.post<T>(url, data)

  invalidatePatterns.forEach((pattern) => {
    const keys = cacheManager.getStats().keys
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        cacheManager.delete(key)
      }
    })
  })

  return response.data
}

/**
 * PUT request that invalidates related cache
 */
export async function cachedPut<T>(
  url: string,
  data: any,
  invalidatePatterns: string[] = []
): Promise<T> {
  const response = await api.put<T>(url, data)

  invalidatePatterns.forEach((pattern) => {
    const keys = cacheManager.getStats().keys
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        cacheManager.delete(key)
      }
    })
  })

  return response.data
}

/**
 * DELETE request that invalidates related cache
 */
export async function cachedDelete<T>(url: string, invalidatePatterns: string[] = []): Promise<T> {
  const response = await api.delete<T>(url)

  invalidatePatterns.forEach((pattern) => {
    const keys = cacheManager.getStats().keys
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        cacheManager.delete(key)
      }
    })
  })

  return response.data
}

export { api, API_BASE_URL, cacheManager }
