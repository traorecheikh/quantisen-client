// Export all services for easy importing
export { UtilisateurService } from './features/utilisateurs/services/utilisateurService.ts'
export { BoissonService } from './features/boisson/services/boissonService.ts'
export { InventaireService } from './features/inventaire/services/inventaireService.ts'
export { StatisticsService } from './features/stats/services/statService'

// Export all models
export * from './features/utilisateurs/models/utilisateurModel.ts'
export * from './features/boisson/models/boisson.ts'
export * from './features/inventaire/models/movementModel.ts'
export * from './features/inventaire/models/ligneOperation.ts'
export * from './features/utilisateurs/models/utilisateurModel.ts'
export * from './features/inventaire/models/lotModel.ts'
export * from './features/stats/models/DashboardStatisticsModel'
export * from './features/stats/models/WeeklyStockMovementModel'
export * from './features/inventaire/requests/createMouvementSortieRequest.ts'
export * from './features/inventaire/requests/createMouvementAjustementRequest.ts'
export * from './features/inventaire/requests/createLotRequest.ts'
export * from './features/inventaire/requests/createLotBatchRequest.ts'

// Export API instance
export { api, API_BASE_URL } from './api'
