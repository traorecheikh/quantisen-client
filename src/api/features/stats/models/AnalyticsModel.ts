// Analytics models for comprehensive statistics
export interface BeveragePerformance {
  id: number;
  name: string;
  totalMovements: number;
  totalQuantity: number;
  revenueImpact?: number;
  rank: number;
}

export interface InventoryAnalytics {
  stockDistribution: StockDistribution[];
  expirationTracking: ExpirationTracking;
  movementAnalysis: MovementAnalysis;
}

export interface StockDistribution {
  category: string;
  percentage: number;
  value: number;
  color: string;
}

export interface ExpirationTracking {
  lotsSoonToExpire: ExpiringLot[];
  expiredLots: ExpiringLot[];
  totalExpiringValue: number;
}

export interface ExpiringLot {
  id: number;
  beverageName: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
  daysUntilExpiration: number;
  value: number;
}

export interface MovementAnalysis {
  mostActiveBeverages: BeverageActivity[];
  leastActiveBeverages: BeverageActivity[];
  seasonalTrends: SeasonalTrend[];
}

export interface BeverageActivity {
  id: number;
  name: string;
  movementCount: number;
  lastMovementDate: string;
  activityScore: number;
}

export interface SeasonalTrend {
  period: string;
  totalMovements: number;
  averageDaily: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface StockAlert {
  id: number;
  beverageName: string;
  currentStock: number;
  threshold: number;
  alertLevel: 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK';
  severity: number;
}

export interface UserActivityStats {
  userId: number;
  userName: string;
  totalMovements: number;
  lastActivity: string;
  activityScore: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  revenueByPeriod: RevenueByPeriod[];
  topRevenueGenerators: RevenueGenerator[];
  profitMargin: number;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  profit: number;
  margin: number;
}

export interface RevenueGenerator {
  beverageId: number;
  beverageName: string;
  revenue: number;
  profit: number;
  margin: number;
}
