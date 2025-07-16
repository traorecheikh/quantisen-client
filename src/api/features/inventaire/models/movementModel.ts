import type {LigneOperation, Utilisateur} from "../../../../../inventaire.ts";



export interface Mouvement {
  id?: number;
  type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';
  dateMouvement?: string; // Format: YYYY-MM-DD
  quantite: number;
  utilisateur: Utilisateur;
  ligneOperations?: LigneOperation[];
  typeAjustement?: 'POSITIVE' | 'NEGATIVE';
  raison?: string;
}
