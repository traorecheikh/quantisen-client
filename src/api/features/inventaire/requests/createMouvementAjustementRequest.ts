import type { Utilisateur } from '../../utilisateurs/models/utilisateurModel.ts'

export interface CreateMouvementAjustementRequest {
  lotId: number
  delta: number
  typeAjustement: 'POSITIF' | 'NEGATIF'
  raison: string
  utilisateur: Utilisateur
}
