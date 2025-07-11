// Movement (Mouvement) model
export type MovementType = 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';
export type AdjustmentType = 'CASSE' | 'VOL' | 'PERTE' | 'RETOUR_CLIENT';

export interface Movement {
  id: number;
  type: MovementType;
  quantite: number;
  boissonId: number;
  utilisateurId: number;
  date: string;
  typeAjustement?: AdjustmentType;
  raison?: string;
}

export interface CreateMovementRequest {
  type: MovementType;
  quantite: number;
  boissonId: number;
  utilisateurId: number;
  typeAjustement?: AdjustmentType;
  raison?: string;
}

