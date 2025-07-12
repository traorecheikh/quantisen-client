import { api } from '../../../api';
import type { Beverage, CreateBeverageRequest } from './../models/beverageModel';

export class BeverageService {
  private static readonly BASE_PATH = '/boissons';

  static async getAllBeverages(): Promise<Beverage[]> {
    const response = await api.get<Beverage[]>(this.BASE_PATH);
    return response.data;
  }

  static async createBeverage(beverageData: CreateBeverageRequest): Promise<Beverage> {
    const response = await api.post<Beverage>(this.BASE_PATH, beverageData);
    return response.data;
  }

  // Placeholder for future update functionality
  static async updateBeverage(id: number, beverageData: Partial<CreateBeverageRequest>): Promise<Beverage> {
    const response = await api.put<Beverage>(`${this.BASE_PATH}/${id}`, beverageData);
    return response.data;
  }

  // Placeholder for future delete functionality
  static async deleteBeverage(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }
}
