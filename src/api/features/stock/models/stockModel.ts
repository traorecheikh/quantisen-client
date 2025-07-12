// Stock model
export interface Stock {
  id: number;
  boissonId: number;
  beverageName: string;
  quantiteTotale: number;
  quantiteDisponible: number;
  quantiteReservee: number;
  seuil: number;
  isLowStock: boolean;
}

// Stock summary for dashboard
export interface StockSummary {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}
