import { cachedGet } from '../../../api'
import { CACHE_TTL } from '../../../../utils/cache'
import type { DashboardStatistics, Stock } from './../models/DashboardStatisticsModel'
import type {
  WeeklyStockMovement,
  MovementTrend,
  DailyMovement,
} from './../models/WeeklyStockMovementModel'
import type {
  BeveragePerformance,
  InventoryAnalytics,
  StockAlert,
  UserActivityStats,
  RevenueMetrics,
} from './../models/AnalyticsModel'

export class StatisticsService {
  private static readonly BASE_PATH = '/statistics'

  static async getDashboardStatistics(): Promise<DashboardStatistics> {
    try {
      const data = await cachedGet<DashboardStatistics>(`${this.BASE_PATH}/dashboard`, {
        ttl: CACHE_TTL.DASHBOARD_STATS,
      })
      return data
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Dashboard statistics error:', error)
      throw error
    }
  }

  static async getWeeklyStockMovement(): Promise<WeeklyStockMovement> {
    try {
      const data = await cachedGet<WeeklyStockMovement>(`${this.BASE_PATH}/weekly-stock-movement`, {
        ttl: CACHE_TTL.ANALYTICS,
      })

      if (!this.isValidWeeklyStockMovement(data)) {
        console.warn('❌ [StatisticsService] Invalid weekly stock movement data structure')
        console.log('🔍 [StatisticsService] Data validation failed for:', data)
      }
      return data
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Weekly stock movement error:', error)
      throw error
    }
  }

  static async getMovementTrends(
    period: 'weekly' | 'monthly' | 'yearly' = 'weekly'
  ): Promise<MovementTrend[]> {
    try {
      const data = await cachedGet<MovementTrend[]>(
        `${this.BASE_PATH}/movement-trends?period=${period}`,
        { ttl: CACHE_TTL.MOVEMENTS }
      )

      if (!this.isValidMovementTrends(data)) {
        console.warn('❌ [StatisticsService] Invalid movement trends data structure')
        console.log('🔍 [StatisticsService] Data validation failed for:', data)
      }

      return data
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Movement trends error:', error)
      throw error
    }
  }

  static async getDailyMovements(startDate: string, endDate: string): Promise<DailyMovement[]> {
    try {
      const data = await cachedGet<DailyMovement[]>(
        `${this.BASE_PATH}/daily-movements?start=${startDate}&end=${endDate}`,
        { ttl: CACHE_TTL.MOVEMENTS }
      )
      return data
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Daily movements error:', error)
      throw error
    }
  }

  static async getBeveragePerformance(): Promise<BeveragePerformance[]> {
    try {
      const data = await cachedGet<BeveragePerformance[]>(
        `${this.BASE_PATH}/beverage-performance`,
        { ttl: CACHE_TTL.ANALYTICS }
      )

      if (!this.isValidBeveragePerformance(data)) {
        console.warn('❌ [StatisticsService] Invalid beverage performance data structure')
        console.log('🔍 [StatisticsService] Data validation failed for:', data)
      }
      return data
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Beverage performance error:', error)
      throw error
    }
  }

  static async getInventoryAnalytics(): Promise<InventoryAnalytics> {
    try {
      const data = await cachedGet<InventoryAnalytics>(`${this.BASE_PATH}/inventory-analytics`, {
        ttl: CACHE_TTL.ANALYTICS,
      })

      if (!this.isValidInventoryAnalytics(data)) {
        console.warn('❌ [StatisticsService] Invalid inventory analytics data structure')
        console.log('🔍 [StatisticsService] Data validation failed for:', data)
      }
      return data
    } catch (error) {
      throw error
    }
  }

  static async getStockAlerts(): Promise<StockAlert[]> {
    try {
      const data = await cachedGet<StockAlert[]>(`${this.BASE_PATH}/stock-alerts`, {
        ttl: CACHE_TTL.STOCKS,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  static async getStocks(): Promise<Stock[]> {
    try {
      const data = await cachedGet<Stock[]>(`${this.BASE_PATH}/stocks`, { ttl: CACHE_TTL.STOCKS })
      return data
    } catch (error) {
      throw error
    }
  }

  static async getExpirationAlerts(): Promise<any> {
    try {
      const data = await cachedGet<any>(`${this.BASE_PATH}/expiration-alerts`, {
        ttl: CACHE_TTL.STOCKS,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  static async getUserActivity(): Promise<UserActivityStats[]> {
    try {
      const data = await cachedGet<UserActivityStats[]>(`${this.BASE_PATH}/user-activity`, {
        ttl: CACHE_TTL.USERS,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  static async getRevenueMetrics(): Promise<RevenueMetrics> {
    try {
      const data = await cachedGet<RevenueMetrics>(`${this.BASE_PATH}/revenue-metrics`, {
        ttl: CACHE_TTL.ANALYTICS,
      })
      return data
    } catch (error) {
      throw error
    }
  }

  private static isValidWeeklyStockMovement(data: any): data is WeeklyStockMovement {
    if (!data || typeof data !== 'object') return false

    if (!Array.isArray(data.weekDates) || !Array.isArray(data.datasets)) return false
    if (
      typeof data.totalEntries !== 'number' ||
      typeof data.totalExits !== 'number' ||
      typeof data.totalAdjustments !== 'number'
    )
      return false

    if (data.weekDates.length !== 7) return false

    if (data.datasets.length !== 3) return false

    for (const dataset of data.datasets) {
      if (!dataset.label || !Array.isArray(dataset.data) || !dataset.movementType || !dataset.color)
        return false
      if (dataset.data.length !== 7) return false
      if (!['ENTREE', 'SORTIE', 'AJUSTEMENT'].includes(dataset.movementType)) return false
      if (!this.isValidHexColor(dataset.color)) return false
      if (!dataset.data.every((val?:number) => val! >= 0)) return false
    }

    return true
  }

  private static isValidMovementTrends(data: any): data is MovementTrend[] {
    if (!Array.isArray(data)) return false

    for (const trend of data) {
      if (!trend || typeof trend !== 'object') return false
      if (
        typeof trend.period !== 'string' ||
        typeof trend.totalMovements !== 'number' ||
        typeof trend.percentageChange !== 'number'
      )
        return false
      if (!['UP', 'DOWN', 'STABLE'].includes(trend.trend)) return false
      if (trend.totalMovements < 0) return false
    }

    return true
  }

  private static isValidBeveragePerformance(data: any): data is BeveragePerformance[] {
    if (!Array.isArray(data)) return false

    for (const beverage of data) {
      if (!beverage || typeof beverage !== 'object') return false
      if (typeof beverage.id !== 'number' || typeof beverage.name !== 'string') return false
      if (typeof beverage.totalMovements !== 'number' || typeof beverage.totalQuantity !== 'number')
        return false
      if (typeof beverage.rank !== 'number') return false
      if (beverage.totalMovements < 0 || beverage.totalQuantity < 0 || beverage.rank < 1)
        return false
      if (
        beverage.revenueImpact !== undefined &&
        (typeof beverage.revenueImpact !== 'number' || beverage.revenueImpact < 0)
      )
        return false
    }

    return true
  }

  private static isValidInventoryAnalytics(data: any): data is InventoryAnalytics {
    if (!data || typeof data !== 'object') return false

    if (!Array.isArray(data.stockDistribution)) return false
    for (const item of data.stockDistribution) {
      if (!item || typeof item !== 'object') return false
      if (
        typeof item.category !== 'string' ||
        typeof item.percentage !== 'number' ||
        typeof item.value !== 'number'
      )
        return false
      if (!this.isValidHexColor(item.color)) return false
      if (item.percentage < 0 || item.percentage > 100 || item.value < 0) return false
    }

    if (!data.expirationTracking || typeof data.expirationTracking !== 'object') return false
    if (!Array.isArray(data.expirationTracking.lotsSoonToExpire)) return false
    if (!Array.isArray(data.expirationTracking.expiredLots)) return false
    if (
      typeof data.expirationTracking.totalExpiringValue !== 'number' ||
      data.expirationTracking.totalExpiringValue < 0
    )
      return false

    for (const lot of data.expirationTracking.lotsSoonToExpire) {
      if (!lot || typeof lot !== 'object') return false
      if (
        typeof lot.id !== 'number' ||
        typeof lot.beverageName !== 'string' ||
        typeof lot.lotNumber !== 'string'
      )
        return false
      if (
        typeof lot.quantity !== 'number' ||
        typeof lot.daysUntilExpiration !== 'number' ||
        typeof lot.value !== 'number'
      )
        return false
      if (!this.isValidDateString(lot.expirationDate)) return false
      if (lot.quantity < 0 || lot.daysUntilExpiration < 0 || lot.value < 0) return false
    }

    if (!data.movementAnalysis || typeof data.movementAnalysis !== 'object') return false
    if (
      !Array.isArray(data.movementAnalysis.mostActiveBeverages) ||
      !Array.isArray(data.movementAnalysis.leastActiveBeverages)
    )
      return false
    if (!Array.isArray(data.movementAnalysis.seasonalTrends)) return false

    const allBeverages = [
      ...data.movementAnalysis.mostActiveBeverages,
      ...data.movementAnalysis.leastActiveBeverages,
    ]
    for (const beverage of allBeverages) {
      if (!beverage || typeof beverage !== 'object') return false
      if (typeof beverage.id !== 'number' || typeof beverage.name !== 'string') return false
      if (typeof beverage.movementCount !== 'number' || typeof beverage.activityScore !== 'number')
        return false
      if (!this.isValidDateString(beverage.lastMovementDate)) return false
      if (beverage.movementCount < 0 || beverage.activityScore < 0 || beverage.activityScore > 100)
        return false
    }

    return true
  }

  private static isValidHexColor(color: string): boolean {
    return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color)
  }

  private static isValidDateString(dateStr: string): boolean {
    if (typeof dateStr !== 'string') return false
    const date = new Date(dateStr)
    return !isNaN(date.getTime()) && dateStr.includes('-')
  }
}
