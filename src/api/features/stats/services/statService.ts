import api from '../../../api.ts';
import type { DashboardStatisticsModel } from '../models/DashboardStatisticsModel';
import type { WeeklyStockMovementModel } from '../models/WeeklyStockMovementModel';

export const statService = {
  async getDashboardStatistics(): Promise<DashboardStatisticsModel> {
    const response = await api.get('/statistics/dashboard');
    return response.data;
  },

  async getWeeklyStockMovement(): Promise<WeeklyStockMovementModel> {
    const response = await api.get('/statistics/weekly-stock-movement');
    return response.data;
  },
};
