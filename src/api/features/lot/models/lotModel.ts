// Lot model
export interface Lot {
  id: number;
  numeroLot: string;
  boissonId: number;
  quantiteInitiale: number;
  quantiteActuelle: number;
  dateEntree: string;
  datePeremption: string;
  isActive: boolean;
}

// Create lot request
export interface CreateLotRequest {
  numeroLot: string;
  boissonId: number;
  quantiteInitiale: number;
  dateEntree: string;
  datePeremption: string;
  isActive?: boolean;
}

// Update lot request
export interface UpdateLotRequest {
  id: number;
  numeroLot: string;
  boissonId: number;
  quantiteInitiale: number;
  quantiteActuelle: number;
  dateEntree: string;
  datePeremption: string;
  isActive: boolean;
}
