// Export all services for easy importing
export { UserService } from './features/users/services/userService';
export { BeverageService } from './features/beverage/services/beverageService';
export { LotService } from './features/lot/services/lotService';
export { MovementService } from './features/movement/services/movementService';
export { StockService } from './features/stock/services/stockService';
export { StatisticsService } from './features/stats/services/statService';

// Export all models
export * from './features/users/models/userModel';
export * from './features/beverage/models/beverageModel';
export * from './features/lot/models/lotModel';
export * from './features/movement/models/movementModel';
export * from './features/stock/models/stockModel';
export * from './features/stats/models/DashboardStatisticsModel';
export * from './features/stats/models/WeeklyStockMovementModel';

// Export API instance
export { api, API_BASE_URL } from './api';
