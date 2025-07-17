import type { LigneOperation, Utilisateur } from '../../../index'

export interface Mouvement {
  id?: number
  type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT'
  dateMouvement?: string
  quantite: number
  utilisateur: Utilisateur
  ligneOperations?: LigneOperation[]
  typeAjustement?: 'POSITIVE' | 'NEGATIVE'
  raison?: string
}
