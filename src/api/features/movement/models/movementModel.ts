// Movement type enum
import type { MovementType } from "./MovementType.ts";
import {AdjustmentType} from "../../../enums/adjustmentType.ts";



// Adjustment type enum


// Movement model
export interface Movement {
  id: number;
  boissonId: number;
  lotId: number;
  quantite: number;
  typeMouvement: MovementType;
  typeAjustement?: AdjustmentType;
  raison?: string;
  utilisateurId: number;
  dateCreation: string;
}

// Create movement request
export interface CreateMovementRequest {
  boissonId: number;
  lotId: number;
  quantite: number;
  typeMouvement: MovementType;
  typeAjustement?: AdjustmentType;
  raison?: string;
  utilisateurId: number;
}

// Batch movement request
export interface BatchMovementRequest {
  movements: CreateMovementRequest[];
}

// CSV row for batch import
export interface MovementCSVRow {
  beverageName: string;
  lotNumber: string;
  quantity: number;
  movementType: string;
  adjustmentType?: string;
  reason?: string;
}
