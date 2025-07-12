export interface Lot {
  id: number;
  numeroLot: string;
  boissonId: number;
  quantiteInitiale: number;
  quantiteActuelle: number;
  dateEntree: string;
  dateExpiration: string;
}

export interface CreateLotRequest {
  numeroLot: string;
  boissonId: number;
  quantiteInitiale: number;
  dateEntree: string;
  dateExpiration: string;
}

export interface UpdateLotRequest extends CreateLotRequest {
  id: number;
  quantiteActuelle: number;
}

