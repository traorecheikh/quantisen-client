import { api } from '../../../api';
import type { DashboardStatistics } from './../models/DashboardStatisticsModel';
import type { WeeklyStockMovement, MovementTrend, DailyMovement } from './../models/WeeklyStockMovementModel';

export class StatisticsService {
  private static readonly BASE_PATH = '/statistics';

  // Get dashboard statistics
  static async getDashboardStatistics(): Promise<DashboardStatistics> {
    const response = await api.get<DashboardStatistics>(`${this.BASE_PATH}/dashboard`);
    return response.data;
  }

  // Get weekly stock movement data
  static async getWeeklyStockMovement(): Promise<WeeklyStockMovement> {
    const response = await api.get<WeeklyStockMovement>(`${this.BASE_PATH}/weekly-stock-movement`);
    return response.data;
  }

  // Additional analytics methods (to be implemented based on backend expansion)
  static async getMovementTrends(period: 'weekly' | 'monthly' | 'yearly' = 'weekly'): Promise<MovementTrend[]> {
    const response = await api.get<MovementTrend[]>(`${this.BASE_PATH}/movement-trends?period=${period}`);
    return response.data;
  }

  static async getDailyMovements(startDate: string, endDate: string): Promise<DailyMovement[]> {
    const response = await api.get<DailyMovement[]>(`${this.BASE_PATH}/daily-movements?start=${startDate}&end=${endDate}`);
    return response.data;
  }

  static async getBeveragePerformance(boissonId?: number): Promise<any> {
    const endpoint = boissonId
      ? `${this.BASE_PATH}/beverage-performance/${boissonId}`
      : `${this.BASE_PATH}/beverage-performance`;
    const response = await api.get(endpoint);
    return response.data;
  }

  static async getInventoryAnalytics(): Promise<any> {
    const response = await api.get(`${this.BASE_PATH}/inventory-analytics`);
    return response.data;
  }
}
