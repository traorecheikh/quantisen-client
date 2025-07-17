import { cachedGet, cachedPost, cachedPut } from '../../../api';
import { CACHE_TTL } from '../../../../utils/cache';
import type {Boisson} from "../models/boisson.ts";
import type {CreateBoissonRequest} from "../requests/createBoissonRequest.ts";

export class BoissonService {
  private static readonly BASE_PATH = '/boissons';

  static async getAllBeverages(): Promise<Boisson[]> {
    return await cachedGet<Boisson[]>(
      this.BASE_PATH,
      { ttl: CACHE_TTL.BEVERAGES }
    );
  }

  static async createBoisson(beverageData: CreateBoissonRequest): Promise<Boisson> {
    return await cachedPost<Boisson>(
      this.BASE_PATH,
      beverageData,
      ['beverages', 'dashboard', 'stocks'] // Invalidate related caches
    );
  }

  static async updateBoisson(id: number, boissonData: Partial<CreateBoissonRequest>): Promise<Boisson> {
    return await cachedPut<Boisson>(
      `${this.BASE_PATH}/${id}`,
      boissonData,
      ['beverages', 'dashboard', 'stocks'] // Invalidate related caches
    );
  }
}
