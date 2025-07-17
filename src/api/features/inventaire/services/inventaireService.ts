import {cachedGet, cachedPost} from '../../../api';
import { CACHE_TTL } from '../../../../utils/cache';
import type {PaginatedResponse} from '../../../models/paginatedResponse';
import type {CreateMouvementSortieRequest} from "../requests/createMouvementSortieRequest.ts";
import type {Lot,} from "./../models/lotModel.ts";
import type {Mouvement} from "./../models/movementModel.ts";
import type {LigneOperation} from "./../models/ligneOperation.ts";
import type {CreateMouvementAjustementRequest} from "../requests/createMouvementAjustementRequest.ts";
import type {CreateLotRequest} from "../requests/createLotRequest.ts";
import type {CreateLotBatchRequest} from "../requests/createLotBatchRequest.ts";

export class InventaireService {
  private static readonly BASE_PATH = '/inventaire';

  static async recordMouvementAjustement(movementData: CreateMouvementAjustementRequest): Promise<void> {
    const response = await cachedPost<void>(
      this.BASE_PATH,
      movementData,
      ['stocks', 'movements', 'dashboard', 'analytics'] // Invalidate related caches
    );
    return response;
  }

  static async recordMouvementEntree(lotData: CreateLotRequest): Promise<void> {
    const response = await cachedPost<void>(
      `${this.BASE_PATH}/entree`,
      lotData,
      ['stocks', 'movements', 'dashboard', 'analytics', 'lots'] // Invalidate related caches
    );
    return response;
  }

  static async recordMouvementEntreeBatch(lotData: CreateLotBatchRequest): Promise<void> {
    const response = await cachedPost<void>(
      `${this.BASE_PATH}/batch`,
      lotData,
      ['stocks', 'movements', 'dashboard', 'analytics', 'lots'] // Invalidate related caches
    );
    return response;
  }

  static async recordMouvementSortie(movementData: CreateMouvementSortieRequest): Promise<void> {
    const response = await cachedPost<void>(
      `${this.BASE_PATH}/sortie`,
      movementData,
      ['stocks', 'movements', 'dashboard', 'analytics', 'lots'] // Invalidate related caches
    );
    return response;
  }

  static async recordAdjustment(movementData: CreateMouvementAjustementRequest, reason: string): Promise<void> {
    const response = await cachedPost<void>(
      `${this.BASE_PATH}/ajustement?raison=${encodeURIComponent(reason)}`,
      movementData,
      ['stocks', 'movements', 'dashboard', 'analytics'] // Invalidate related caches
    );
    return response;
  }

  static async getMovementsByUser(userId: number): Promise<Mouvement[]> {
    return await cachedGet<Mouvement[]>(
      `${this.BASE_PATH}/utilisateur/${userId}`,
      { ttl: CACHE_TTL.MOVEMENTS }
    );
  }

  static async getAllMovements(): Promise<Mouvement[]> {
    return await cachedGet<Mouvement[]>(
      this.BASE_PATH,
      { ttl: CACHE_TTL.MOVEMENTS }
    );
  }

  static async getAllValidLots(): Promise<Lot[]>{
    return await cachedGet<Lot[]>(
      `${this.BASE_PATH}/lots/valid`,
      { ttl: CACHE_TTL.LOTS }
    );
  }

  static async getAllLots(): Promise<Lot[]> {
    return await cachedGet<Lot[]>(
      `${this.BASE_PATH}/lots`,
      { ttl: CACHE_TTL.LOTS }
    );
  }

  static async getAllLotsByBoissonId(boissonId: number): Promise<Lot[]> {
    return await cachedGet<Lot[]>(
      `${this.BASE_PATH}/lots/boisson/${boissonId}`,
      { ttl: CACHE_TTL.LOTS }
    );
  }

  static async getAllMouvementsByLotId(lotId: number): Promise<Mouvement[]> {
    return await cachedGet<Mouvement[]>(
      `${this.BASE_PATH}/lots/${lotId}/mouvements`,
      { ttl: CACHE_TTL.MOVEMENTS }
    );
  }

  static async getAllLigneOperationsByMouvementId(mouvementId: number): Promise<LigneOperation[]> {
    return await cachedGet<LigneOperation[]>(
      `${this.BASE_PATH}/ligne-operations/mouvements/${mouvementId}`,
      { ttl: CACHE_TTL.MOVEMENTS }
    );
  }

  static async getAllLigneOperationsPaginated(
    page: number = 1,
    size: number = 10
  ): Promise<PaginatedResponse<LigneOperation>> {
    return await cachedGet<PaginatedResponse<LigneOperation>>(
      `${this.BASE_PATH}/ligne-operations?page=${page}&size=${size}`,
      { ttl: CACHE_TTL.MOVEMENTS }
    );
  }

  static async getAllLigneOperations(): Promise<LigneOperation[]> {
    const response = await this.getAllLigneOperationsPaginated(1, 1000); // Get a large page
    return response.data;
  }
}
