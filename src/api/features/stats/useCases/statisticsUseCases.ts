import { StatisticsService } from '../services/statService'
import type { DashboardStatistics } from '../models/DashboardStatisticsModel'
import type { WeeklyStockMovement, MovementTrend, DailyMovement } from '../models/WeeklyStockMovementModel'
import type { 
  BeveragePerformance, 
  InventoryAnalytics, 
  StockAlert, 
  UserActivityStats, 
  RevenueMetrics 
} from '../models/AnalyticsModel'

export class StatisticsUseCases {
  
  /**
   * Dashboard Statistics Use Cases
   */
  static async getDashboardOverview(): Promise<DashboardStatistics> {
    try {
      return await StatisticsService.getDashboardStatistics()
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error)
      throw new Error('Impossible de récupérer les statistiques du tableau de bord')
    }
  }

  /**
   * Weekly Stock Movement Use Cases
   */
  static async getWeeklyStockMovement(): Promise<WeeklyStockMovement> {
    try {
      return await StatisticsService.getWeeklyStockMovement()
    } catch (error) {
      console.error('Error fetching weekly stock movement:', error)
      throw new Error('Impossible de récupérer les mouvements de stock hebdomadaires')
    }
  }

  /**
   * Movement Trends Use Cases
   */
  static async getMovementTrends(period: 'weekly' | 'monthly' | 'yearly' = 'weekly'): Promise<MovementTrend[]> {
    try {
      return await StatisticsService.getMovementTrends(period)
    } catch (error) {
      console.error('Error fetching movement trends:', error)
      throw new Error('Impossible de récupérer les tendances de mouvement')
    }
  }

  /**
   * Daily Movements Use Cases
   */
  static async getDailyMovements(startDate: string, endDate: string): Promise<DailyMovement[]> {
    try {
      return await StatisticsService.getDailyMovements(startDate, endDate)
    } catch (error) {
      console.error('Error fetching daily movements:', error)
      throw new Error('Impossible de récupérer les mouvements quotidiens')
    }
  }

  /**
   * Beverage Performance Use Cases
   */
  static async getBeveragePerformance(): Promise<BeveragePerformance[]> {
    try {
      return await StatisticsService.getBeveragePerformance()
    } catch (error) {
      console.error('Error fetching beverage performance:', error)
      throw new Error('Impossible de récupérer les performances des boissons')
    }
  }

  /**
   * Inventory Analytics Use Cases
   */
  static async getInventoryAnalytics(): Promise<InventoryAnalytics> {
    try {
      return await StatisticsService.getInventoryAnalytics()
    } catch (error) {
      console.error('Error fetching inventory analytics:', error)
      throw new Error('Impossible de récupérer les analyses d\'inventaire')
    }
  }

  /**
   * Stock Alerts Use Cases
   */
  static async getStockAlerts(): Promise<StockAlert[]> {
    try {
      return await StatisticsService.getStockAlerts()
    } catch (error) {
      console.error('Error fetching stock alerts:', error)
      throw new Error('Impossible de récupérer les alertes de stock')
    }
  }

  /**
   * Expiration Alerts Use Cases
   */
  static async getExpirationAlerts(): Promise<any> {
    try {
      return await StatisticsService.getExpirationAlerts()
    } catch (error) {
      console.error('Error fetching expiration alerts:', error)
      throw new Error('Impossible de récupérer les alertes d\'expiration')
    }
  }

  /**
   * User Activity Use Cases
   */
  static async getUserActivity(): Promise<UserActivityStats[]> {
    try {
      return await StatisticsService.getUserActivity()
    } catch (error) {
      console.error('Error fetching user activity:', error)
      throw new Error('Impossible de récupérer l\'activité des utilisateurs')
    }
  }

  /**
   * Revenue Metrics Use Cases
   */
  static async getRevenueMetrics(): Promise<RevenueMetrics> {
    try {
      return await StatisticsService.getRevenueMetrics()
    } catch (error) {
      console.error('Error fetching revenue metrics:', error)
      throw new Error('Impossible de récupérer les métriques de revenus')
    }
  }

  /**
   * Export Use Cases
   */
  static async exportStatisticsPDF(type: 'dashboard' | 'analytics' | 'inventory'): Promise<Blob> {
    try {
      return await StatisticsService.exportStatisticsPDF(type)
    } catch (error) {
      console.error('Error exporting statistics to PDF:', error)
      throw new Error('Impossible d\'exporter les statistiques en PDF')
    }
  }

  static async exportStatisticsExcel(type: 'movements' | 'inventory' | 'performance'): Promise<Blob> {
    try {
      return await StatisticsService.exportStatisticsExcel(type)
    } catch (error) {
      console.error('Error exporting statistics to Excel:', error)
      throw new Error('Impossible d\'exporter les statistiques en Excel')
    }
  }

  static async exportStatisticsCSV(type: 'movements' | 'inventory' | 'performance'): Promise<Blob> {
    try {
      return await StatisticsService.exportStatisticsCSV(type)
    } catch (error) {
      console.error('Error exporting statistics to CSV:', error)
      throw new Error('Impossible d\'exporter les statistiques en CSV')
    }
  }

  /**
   * Utility Methods
   */
  static calculateTrendDirection(current: number, previous: number): 'UP' | 'DOWN' | 'STABLE' {
    if (current > previous) return 'UP'
    if (current < previous) return 'DOWN'
    return 'STABLE'
  }

  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0
    return Math.round(((current - previous) / previous) * 100)
  }

  static formatMovementData(rawData: any[]): WeeklyStockMovement {
    // Process raw data into chart-friendly format
    const dates = rawData.map(item => item.date)
    const entries = rawData.map(item => item.entries || 0)
    const exits = rawData.map(item => item.exits || 0)
    const adjustments = rawData.map(item => item.adjustments || 0)

    return {
      weekDates: dates,
      datasets: [
        {
          label: 'Entrées',
          data: entries,
          movementType: 'ENTREE',
          color: '#10b981'
        },
        {
          label: 'Sorties',
          data: exits,
          movementType: 'SORTIE',
          color: '#ef4444'
        },
        {
          label: 'Ajustements',
          data: adjustments,
          movementType: 'AJUSTEMENT',
          color: '#f59e0b'
        }
      ],
      totalEntries: entries.reduce((sum, val) => sum + val, 0),
      totalExits: exits.reduce((sum, val) => sum + val, 0),
      totalAdjustments: adjustments.reduce((sum, val) => sum + val, 0)
    }
  }

  static categorizeStockAlerts(alerts: StockAlert[]): {
    low: StockAlert[],
    critical: StockAlert[],
    outOfStock: StockAlert[]
  } {
    return {
      low: alerts.filter(alert => alert.alertLevel === 'LOW'),
      critical: alerts.filter(alert => alert.alertLevel === 'CRITICAL'),
      outOfStock: alerts.filter(alert => alert.alertLevel === 'OUT_OF_STOCK')
    }
  }

  static prioritizeExpirationAlerts(lots: any[]): any[] {
    return lots.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration)
  }
}
