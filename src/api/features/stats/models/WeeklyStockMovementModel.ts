// Weekly stock movement model
export interface WeeklyStockMovement {
  weekDates: string[]
  datasets: WeeklyDataset[]
  totalEntries: number
  totalExits: number
  totalAdjustments: number
}

// Weekly dataset for chart display
export interface WeeklyDataset {
  label: string
  data: number[]
  movementType: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT'
  color: string
}

// Daily movement data
export interface DailyMovement {
  date: string
  entries: number
  exits: number
  adjustments: number
  netMovement: number
}

// Movement trend data
export interface MovementTrend {
  period: string
  totalMovements: number
  percentageChange: number
  trend: 'UP' | 'DOWN' | 'STABLE'
}
