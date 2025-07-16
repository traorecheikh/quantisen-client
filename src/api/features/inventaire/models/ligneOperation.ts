import type {Mouvement} from "./movementModel.ts";
import type {Lot} from "./lotModel.ts";

export interface LigneOperation {
  id?: number;
  mouvement?: Mouvement;
  lot?: Lot;
  quantite: number;
}