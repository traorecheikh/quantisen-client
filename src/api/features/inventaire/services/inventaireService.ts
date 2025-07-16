import { api } from '../../../api';
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
    const response = await api.post(this.BASE_PATH, movementData);
    return response.status ==  201 ? response.data : Promise.reject(new Error('Failed to record adjustment'));
  }

  static async recordMouvementEntree(lotData: CreateLotRequest): Promise<void> {
    const response = await api.post(
      `${this.BASE_PATH}/entree`,
      lotData
    );
    return response.status === 201 ? response.data : Promise.reject(new Error('Failed to record movement'));
  }
  static async recordMouvementEntreeBatch(lotData: CreateLotBatchRequest): Promise<void> {
    const response = await api.post(
      `${this.BASE_PATH}/batch`,
      lotData
    );
    console.log(lotData)
    return response.status === 201 ? response.data : Promise.reject(new Error('Failed to record movement'));
  }

  static async recordMouvementSortie(movementData: CreateMouvementSortieRequest): Promise<void> {
    const response = await api.post(
      `${this.BASE_PATH}/sortie`,
      movementData
    );
    return response.status === 201 ? response.data : Promise.reject(new Error('Failed to record movement'));
  }

  static async recordAdjustment(movementData: CreateMouvementAjustementRequest, reason: string): Promise<void> {
    const response = await api.post(
      `${this.BASE_PATH}/ajustement?raison=${encodeURIComponent(reason)}`,
      movementData
    );
    return response.data;
  }

  static async getMovementsByUser(userId: number): Promise<Mouvement[]> {
    const response = await api.get<Mouvement[]>(`${this.BASE_PATH}/utilisateur/${userId}`);
    return response.data;
  }

  static async getAllMovements(): Promise<Mouvement[]> {
    const response = await api.get<Mouvement[]>(this.BASE_PATH);
    return response.data;
  }

  static async getAllValidLots(): Promise<Lot[]>{
    const response = await api.get<Lot[]>(`${this.BASE_PATH}/lots/valid`);
    return response.data;
  }
  static async getAllLots(): Promise<Lot[]> {
    const response = await api.get<Lot[]>(`${this.BASE_PATH}/lots`);
    console.log(response.data)
    return response.data;
  }

  static async getAllLotsByBoissonId(boissonId: number): Promise<Lot[]> {
    const response = await api.get<Lot[]>(`${this.BASE_PATH}/lots/boisson/${boissonId}`);
    return response.data;
  }

  static  async getAllMouvementsByLotId(lotId: number): Promise<Mouvement[]> {
    const response = await api.get<Mouvement[]>(`${this.BASE_PATH}/lots/${lotId}/mouvements`);
    return response.data;
  }
  static async getAllLigneOperationsByMouvementId(mouvementId: number): Promise<LigneOperation[]> {
    const response = await api.get<LigneOperation[]>(`${this.BASE_PATH}/ligne-operations/mouvements/${mouvementId}`);
    return response.data;
  }

  static async getAllLigneOperationsByLotId(lotId: number): Promise<LigneOperation[]> {
    const response = await api.get<LigneOperation[]>(`${this.BASE_PATH}/ligne-operations/${lotId}`);
    return response.data;
  }

  static async getAllLigneOperations(): Promise<LigneOperation[]> {
    const response = await api.get<LigneOperation[]>(`${this.BASE_PATH}/ligne-operations`);
    return response.data;
  }
}
