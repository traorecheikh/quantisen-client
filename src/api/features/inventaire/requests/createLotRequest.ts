import type { Lot, Utilisateur } from '../../../index'

export interface CreateLotRequest {
  lot: Omit<Lot, 'id' | 'quantiteActuelle' | 'mouvementEntree' | 'dateEntree' | 'vendable'>
  utilisateur: Pick<Utilisateur, 'id'>
}
