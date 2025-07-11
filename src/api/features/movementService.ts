import api from '../api';
import type { Movement, CreateMovementRequest } from './movementModel';

export const movementService = {
  create(data: CreateMovementRequest) {
    return api.post<Movement>('/mouvements', data);
  },
  createBatch(data: CreateMovementRequest[]) {
    return api.post<Movement[]>('/mouvements/batch', data);
  },
  createReturn(data: CreateMovementRequest, raison: string) {
    return api.post<Movement>(`/mouvements/retour?raison=${encodeURIComponent(raison)}`, data);
  },
  createAdjustment(data: CreateMovementRequest, raison: string) {
    return api.post<Movement>(`/mouvements/ajustement?raison=${encodeURIComponent(raison)}`, data);
  },
  getByUser(utilisateurId: number) {
    return api.get<Movement[]>(`/mouvements/utilisateur/${utilisateurId}`);
  },
};
