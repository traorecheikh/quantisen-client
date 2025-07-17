// Dashboard statistics model
export interface DashboardStatistics {
  totalBeverages: number
  totalStock: number
  lowStockAlerts: number
  totalMovements: number
  totalUsers: number
  totalValue: number
  stockAlerts: StockAlert[]
}

export interface RecentMovement {
  id: number
  beverageName: string
  movementType: string
  quantity: number
  date: string
  userName: string
}

// Top beverage for dashboard
export interface TopBeverage {
  id: number
  name: string
  totalMovements: number
  totalQuantity: number
}

// Stock alert for dashboard
export interface StockAlert {
  id: number
  beverageName: string
  currentStock: number
  threshold: number
  alertLevel: 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK'
}

export interface Stock {
  alertSecurityLevel: 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK' | 'OK'
  beverageName: string
  currentStockLevel: number
  threshold: number
}
