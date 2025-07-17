import { StatisticsService } from '../services/statService'
import type { DashboardStatistics } from '../models/DashboardStatisticsModel'
import type {
  WeeklyStockMovement,
  MovementTrend,
  DailyMovement,
} from '../models/WeeklyStockMovementModel'
import type {
  BeveragePerformance,
  InventoryAnalytics,
  StockAlert,
  UserActivityStats,
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
  static async getMovementTrends(
    period: 'weekly' | 'monthly' | 'yearly' = 'weekly'
  ): Promise<MovementTrend[]> {
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
      throw new Error("Impossible de récupérer les analyses d'inventaire")
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
      throw new Error("Impossible de récupérer les alertes d'expiration")
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
      throw new Error("Impossible de récupérer l'activité des utilisateurs")
    }
  }

  /**
   * Revenue Metrics Use Cases
   */



}
