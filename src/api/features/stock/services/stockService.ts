import { api } from '../../../api';
import type { Stock, StockSummary } from './../models/stockModel';

export class StockService {
  private static readonly BASE_PATH = '/stocks';

  static async getAllStocks(): Promise<Stock[]> {
    const response = await api.get<Stock[]>(this.BASE_PATH);
    return response.data;
  }

  static async getStockByBeverage(boissonId: number): Promise<Stock> {
    const response = await api.get<Stock>(`${this.BASE_PATH}/boisson/${boissonId}`);
    return response.data;
  }

  static async getStockSummary(): Promise<StockSummary> {
    const response = await api.get<StockSummary>(`${this.BASE_PATH}/summary`);
    return response.data;
  }

  static async getLowStockItems(): Promise<Stock[]> {
    const response = await api.get<Stock[]>(`${this.BASE_PATH}/low-stock`);
    return response.data;
  }

  static async getOutOfStockItems(): Promise<Stock[]> {
    const response = await api.get<Stock[]>(`${this.BASE_PATH}/out-of-stock`);
    return response.data;
  }
}
