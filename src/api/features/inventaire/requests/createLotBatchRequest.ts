import type { Lot } from '../models/lotModel.ts'
import type { Utilisateur } from '../../utilisateurs/models/utilisateurModel.ts'

export interface CreateLotBatchRequest {
  lots: Omit<Lot, 'id'>[]
  utilisateur: Utilisateur
}
