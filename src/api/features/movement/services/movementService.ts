import { api } from '../../../api';
import type {
  Movement,
  CreateMovementRequest,
  MovementCSVRow
} from './../models/movementModel';

export class MovementService {
  private static readonly BASE_PATH = '/mouvements';

  // Record a single movement
  static async recordMovement(movementData: CreateMovementRequest): Promise<Movement> {
    const response = await api.post<Movement>(this.BASE_PATH, movementData);
    return response.data;
  }

  // Record multiple movements in batch
  static async recordBatchMovements(movements: CreateMovementRequest[]): Promise<Movement[]> {
    const response = await api.post<Movement[]>(`${this.BASE_PATH}/batch`, movements);
    return response.data;
  }

  // Record a return with reason
  static async recordReturn(movementData: CreateMovementRequest, reason: string): Promise<Movement> {
    const response = await api.post<Movement>(
      `${this.BASE_PATH}/retour?raison=${encodeURIComponent(reason)}`,
      movementData
    );
    return response.data;
  }

  // Record an adjustment with reason
  static async recordAdjustment(movementData: CreateMovementRequest, reason: string): Promise<Movement> {
    const response = await api.post<Movement>(
      `${this.BASE_PATH}/ajustement?raison=${encodeURIComponent(reason)}`,
      movementData
    );
    return response.data;
  }

  // Get movements by user
  static async getMovementsByUser(userId: number): Promise<Movement[]> {
    const response = await api.get<Movement[]>(`${this.BASE_PATH}/utilisateur/${userId}`);
    return response.data;
  }

  // Helper method to convert CSV data to movement requests
  static convertCSVToMovements(csvData: MovementCSVRow[], beverageMap: Map<string, number>, lotMap: Map<string, number>, userId: number): CreateMovementRequest[] {
    return csvData.map(row => ({
      boissonId: beverageMap.get(row.beverageName) || 0,
      lotId: lotMap.get(row.lotNumber) || 0,
      quantite: row.quantity,
      typeMouvement: row.movementType as any,
      typeAjustement: row.adjustmentType as any,
      raison: row.reason,
      utilisateurId: userId
    }));
  }

  // Parse CSV content
  static parseCSV(csvContent: string): MovementCSVRow[] {
    const lines = csvContent.split('\n');
    // const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      return {
        beverageName: values[0],
        lotNumber: values[1],
        quantity: parseInt(values[2]),
        movementType: values[3],
        adjustmentType: values[4] || undefined,
        reason: values[5] || undefined
      };
    });
  }
}
