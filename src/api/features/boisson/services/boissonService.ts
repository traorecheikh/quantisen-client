import { api } from '../../../api';
import type {Boisson} from "../models/boisson.ts";
import type {CreateBoissonRequest} from "../requests/createBoissonRequest.ts";

export class BoissonService {
  private static readonly BASE_PATH = '/boissons';

  static async getAllBeverages(): Promise<Boisson[]> {
    const response = await api.get<Boisson[]>(this.BASE_PATH);
    return response.data;
  }

  static async createBoisson(beverageData: CreateBoissonRequest): Promise<Boisson> {
    const response = await api.post<Boisson>(this.BASE_PATH, beverageData);
    return response.data;
  }
  static async updateBoisson(id: number, boissonData: Partial<CreateBoissonRequest>): Promise<Boisson> {
    const response = await api.put<Boisson>(`${this.BASE_PATH}/${id}`, boissonData);
    return response.data;
  }

}
