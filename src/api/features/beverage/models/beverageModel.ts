export interface Beverage {
  id: number;
  nom: string;
  description: string;
  prix: number;
  volume: number;
  unite: string;
  seuil: number;
  isActive: boolean;
}

export interface CreateBeverageRequest {
  nom: string;
  description: string;
  prix: number;
  volume: number;
  unite: string;
  seuil: number;
}

