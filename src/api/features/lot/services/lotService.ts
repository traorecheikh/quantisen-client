import { api } from '../../../api';
import type { Lot, CreateLotRequest, UpdateLotRequest } from './../models/lotModel';

export class LotService {
  private static readonly BASE_PATH = '/lots';

  static async getAllLots(): Promise<Lot[]> {
    const response = await api.get<Lot[]>(this.BASE_PATH);
    return response.data;
  }

  static async getAvailableLots(): Promise<Lot[]> {
    const response = await api.get<Lot[]>(`${this.BASE_PATH}/disponibles`);
    return response.data;
  }

  static async createLot(lotData: CreateLotRequest): Promise<Lot> {
    const response = await api.post<Lot>(this.BASE_PATH, lotData);
    return response.data;
  }

  static async updateLot(lotData: UpdateLotRequest): Promise<Lot> {
    const response = await api.put<Lot>(this.BASE_PATH, lotData);
    return response.data;
  }

  static async isLotAvailable(lotId: number): Promise<boolean> {
    const response = await api.get<boolean>(`${this.BASE_PATH}/${lotId}/is-available`);
    return response.data;
  }

  static async isLotExpired(lotId: number): Promise<boolean> {
    const response = await api.get<boolean>(`${this.BASE_PATH}/${lotId}/is-expired`);
    return response.data;
  }

  static async getLotsByBeverageOrderedByExpiration(boissonId: number): Promise<Lot[]> {
    const response = await api.get<Lot[]>(`${this.BASE_PATH}/boisson/${boissonId}/ordre-peremption`);
    return response.data;
  }

  static async removeQuantityFromLot(lotId: number, quantity: number): Promise<void> {
    await api.post(`${this.BASE_PATH}/${lotId}/remove-quantity?quantity=${quantity}`);
  }
}
