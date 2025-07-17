import type {Mouvement} from "./movementModel.ts";
import type {Boisson} from "../../boisson/models/boisson.ts";

export interface Lot {
  id?: number;
  numeroLot: string;
  quantiteInitiale: number;
  fournisseur?: string;
  quantiteActuelle?: number;
  mouvementEntree?: Mouvement;
  dateEntree?: string; // Format: YYYY-MM-DD
  datePeremption: string; // Format: YYYY-MM-DD
  boisson: Boisson;
  vendable?: boolean;
}
