import { api } from '../../../api';
import type { DashboardStatistics } from './../models/DashboardStatisticsModel';
import type { WeeklyStockMovement, MovementTrend, DailyMovement } from './../models/WeeklyStockMovementModel';
import type {
  BeveragePerformance,
  InventoryAnalytics,
  StockAlert,
  UserActivityStats,
  RevenueMetrics
} from './../models/AnalyticsModel';

export class StatisticsService {
  private static readonly BASE_PATH = '/statistics';

  // Get dashboard statistics
  static async getDashboardStatistics(): Promise<DashboardStatistics> {
    try {
      console.log('🔍 [StatisticsService] Fetching dashboard statistics...');
      const response = await api.get<DashboardStatistics>(`${this.BASE_PATH}/dashboard`);
      console.log('✅ [StatisticsService] Dashboard statistics response received:', response);
      console.log('📊 [StatisticsService] Dashboard data structure:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Dashboard statistics error:', error);
      console.log('🔄 [StatisticsService] Using mock dashboard data');
      return this.getMockDashboardStatistics();
    }
  }

  // Get weekly stock movement data
  static async getWeeklyStockMovement(): Promise<WeeklyStockMovement> {
    try {
      console.log('🔍 [StatisticsService] Fetching weekly stock movement...');
      const response = await api.get<WeeklyStockMovement>(`${this.BASE_PATH}/weekly-stock-movement`);
      console.log('✅ [StatisticsService] Weekly stock movement response received:', response);
      console.log('📊 [StatisticsService] Weekly movement data:', JSON.stringify(response.data, null, 2));

      const data = response.data;

      // Validate the data structure
      if (!this.isValidWeeklyStockMovement(data)) {
        console.warn('❌ [StatisticsService] Invalid weekly stock movement data structure');
        console.log('🔍 [StatisticsService] Data validation failed for:', data);
        console.log('🔄 [StatisticsService] Using mock weekly stock movement data');
        return this.getMockWeeklyStockMovement();
      }

      console.log('✅ [StatisticsService] Weekly stock movement data validation passed');
      return data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Weekly stock movement error:', error);
      console.log('🔄 [StatisticsService] Using mock weekly stock movement data');
      return this.getMockWeeklyStockMovement();
    }
  }

  // Get movement trends
  static async getMovementTrends(period: 'weekly' | 'monthly' | 'yearly' = 'weekly'): Promise<MovementTrend[]> {
    try {
      console.log(`🔍 [StatisticsService] Fetching movement trends for period: ${period}`);
      const response = await api.get<MovementTrend[]>(`${this.BASE_PATH}/movement-trends?period=${period}`);
      console.log('✅ [StatisticsService] Movement trends response received:', response);
      console.log('📊 [StatisticsService] Movement trends data:', JSON.stringify(response.data, null, 2));

      const data = response.data;

      // Validate the data structure
      if (!this.isValidMovementTrends(data)) {
        console.warn('❌ [StatisticsService] Invalid movement trends data structure');
        console.log('🔍 [StatisticsService] Data validation failed for:', data);
        console.log('🔄 [StatisticsService] Using mock movement trends data');
        return this.getMockMovementTrends(period);
      }

      console.log('✅ [StatisticsService] Movement trends data validation passed');
      return data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Movement trends error:', error);
      console.log('🔄 [StatisticsService] Using mock movement trends data');
      return this.getMockMovementTrends(period);
    }
  }

  // Get daily movements with date range
  static async getDailyMovements(startDate: string, endDate: string): Promise<DailyMovement[]> {
    try {
      console.log(`🔍 [StatisticsService] Fetching daily movements from ${startDate} to ${endDate}`);
      const response = await api.get<DailyMovement[]>(`${this.BASE_PATH}/daily-movements?start=${startDate}&end=${endDate}`);
      console.log('✅ [StatisticsService] Daily movements response received:', response);
      console.log('📊 [StatisticsService] Daily movements data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Daily movements error:', error);
      console.log('🔄 [StatisticsService] Using mock daily movements data');
      return this.getMockDailyMovements();
    }
  }

  // Get beverage performance statistics
  static async getBeveragePerformance(): Promise<BeveragePerformance[]> {
    try {
      console.log('🔍 [StatisticsService] Fetching beverage performance...');
      const response = await api.get<BeveragePerformance[]>(`${this.BASE_PATH}/beverage-performance`);
      console.log('✅ [StatisticsService] Beverage performance response received:', response);
      console.log('📊 [StatisticsService] Beverage performance data:', JSON.stringify(response.data, null, 2));

      const data = response.data;

      // Validate the data structure
      if (!this.isValidBeveragePerformance(data)) {
        console.warn('❌ [StatisticsService] Invalid beverage performance data structure');
        console.log('🔍 [StatisticsService] Data validation failed for:', data);
        console.log('🔄 [StatisticsService] Using mock beverage performance data');
        return this.getMockBeveragePerformance();
      }

      console.log('✅ [StatisticsService] Beverage performance data validation passed');
      return data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Beverage performance error:', error);
      console.log('🔄 [StatisticsService] Using mock beverage performance data');
      return this.getMockBeveragePerformance();
    }
  }

  // Get inventory analytics
  static async getInventoryAnalytics(): Promise<InventoryAnalytics> {
    try {
      console.log('🔍 [StatisticsService] Fetching inventory analytics...');
      const response = await api.get<InventoryAnalytics>(`${this.BASE_PATH}/inventory-analytics`);
      console.log('✅ [StatisticsService] Inventory analytics response received:', response);
      console.log('📊 [StatisticsService] Inventory analytics data:', JSON.stringify(response.data, null, 2));

      const data = response.data;

      // Validate the data structure
      if (!this.isValidInventoryAnalytics(data)) {
        console.warn('❌ [StatisticsService] Invalid inventory analytics data structure');
        console.log('🔍 [StatisticsService] Data validation failed for:', data);
        console.log('🔄 [StatisticsService] Using mock inventory analytics data');
        return this.getMockInventoryAnalytics();
      }

      console.log('✅ [StatisticsService] Inventory analytics data validation passed');
      return data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Inventory analytics error:', error);
      console.log('🔄 [StatisticsService] Using mock inventory analytics data');
      return this.getMockInventoryAnalytics();
    }
  }

  // Get stock alerts
  static async getStockAlerts(): Promise<StockAlert[]> {
    try {
      console.log('🔍 [StatisticsService] Fetching stock alerts...');
      const response = await api.get<StockAlert[]>(`${this.BASE_PATH}/stock-alerts`);
      console.log('✅ [StatisticsService] Stock alerts response received:', response);
      console.log('📊 [StatisticsService] Stock alerts data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Stock alerts error:', error);
      console.log('🔄 [StatisticsService] Using mock stock alerts data');
      return this.getMockStockAlerts();
    }
  }

  // Get expiration alerts
  static async getExpirationAlerts(): Promise<any> {
    try {
      console.log('🔍 [StatisticsService] Fetching expiration alerts...');
      const response = await api.get(`${this.BASE_PATH}/expiration-alerts`);
      console.log('✅ [StatisticsService] Expiration alerts response received:', response);
      console.log('📊 [StatisticsService] Expiration alerts data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Expiration alerts error:', error);
      console.log('🔄 [StatisticsService] Using mock expiration alerts data');
      return this.getMockExpirationAlerts();
    }
  }

  // Get user activity statistics
  static async getUserActivity(): Promise<UserActivityStats[]> {
    try {
      console.log('🔍 [StatisticsService] Fetching user activity...');
      const response = await api.get<UserActivityStats[]>(`${this.BASE_PATH}/user-activity`);
      console.log('✅ [StatisticsService] User activity response received:', response);
      console.log('📊 [StatisticsService] User activity data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] User activity error:', error);
      console.log('🔄 [StatisticsService] Using mock user activity data');
      return this.getMockUserActivity();
    }
  }

  // Get revenue metrics
  static async getRevenueMetrics(): Promise<RevenueMetrics> {
    try {
      console.log('🔍 [StatisticsService] Fetching revenue metrics...');
      const response = await api.get<RevenueMetrics>(`${this.BASE_PATH}/revenue-metrics`);
      console.log('✅ [StatisticsService] Revenue metrics response received:', response);
      console.log('📊 [StatisticsService] Revenue metrics data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.warn('⚠️ [StatisticsService] Revenue metrics error:', error);
      console.log('🔄 [StatisticsService] Using mock revenue metrics data');
      return this.getMockRevenueMetrics();
    }
  }

  // Export statistics as PDF
  static async exportStatisticsPDF(type: 'dashboard' | 'analytics' | 'inventory'): Promise<Blob> {
    try {
      const response = await api.get(`${this.BASE_PATH}/export/pdf?type=${type}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.warn('Backend export not available');
      throw new Error('Export functionality not available');
    }
  }

  // Export statistics as Excel
  static async exportStatisticsExcel(type: 'movements' | 'inventory' | 'performance'): Promise<Blob> {
    try {
      const response = await api.get(`${this.BASE_PATH}/export/excel?type=${type}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.warn('Backend export not available');
      throw new Error('Export functionality not available');
    }
  }

  // Mock data methods for development
  private static getMockDashboardStatistics(): DashboardStatistics {
    return {
      totalBeverages: 25,
      totalStock: 1250,
      lowStockAlerts: 3,
      totalMovements: 147,
      totalUsers: 8,
      totalValue: 2500000,
      recentMovements: [
        {
          id: 1,
          beverageName: 'Coca-Cola 500ml',
          movementType: 'ENTREE',
          quantity: 100,
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          userName: 'Admin User'
        },
        {
          id: 2,
          beverageName: 'Pepsi 330ml',
          movementType: 'SORTIE',
          quantity: 50,
          date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          userName: 'John Doe'
        },
        {
          id: 3,
          beverageName: 'Sprite 500ml',
          movementType: 'AJUSTEMENT',
          quantity: 25,
          date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          userName: 'Jane Smith'
        }
      ],
      topBeverages: [
        {
          id: 1,
          name: 'Coca-Cola 500ml',
          totalMovements: 45,
          totalQuantity: 450
        },
        {
          id: 2,
          name: 'Pepsi 330ml',
          totalMovements: 32,
          totalQuantity: 320
        },
        {
          id: 3,
          name: 'Sprite 500ml',
          totalMovements: 28,
          totalQuantity: 280
        }
      ],
      stockAlerts: [
        {
          id: 1,
          beverageName: 'Fanta Orange 500ml',
          currentStock: 5,
          threshold: 20,
          alertLevel: 'CRITICAL'
        },
        {
          id: 2,
          beverageName: 'Coca-Cola Zero 330ml',
          currentStock: 15,
          threshold: 30,
          alertLevel: 'LOW'
        },
        {
          id: 3,
          beverageName: 'Pepsi Max 500ml',
          currentStock: 0,
          threshold: 25,
          alertLevel: 'OUT_OF_STOCK'
        }
      ]
    };
  }

  private static getMockWeeklyStockMovement(): WeeklyStockMovement {
    return {
      weekDates: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      datasets: [
        {
          label: 'Entrées',
          data: [120, 95, 140, 80, 110, 160, 90],
          movementType: 'ENTREE',
          color: '#10b981'
        },
        {
          label: 'Sorties',
          data: [85, 110, 95, 125, 90, 75, 105],
          movementType: 'SORTIE',
          color: '#ef4444'
        },
        {
          label: 'Ajustements',
          data: [10, 5, 15, 8, 12, 6, 9],
          movementType: 'AJUSTEMENT',
          color: '#f59e0b'
        }
      ],
      totalEntries: 795,
      totalExits: 685,
      totalAdjustments: 65
    };
  }

  private static getMockMovementTrends(period: string): MovementTrend[] {
    return [
      {
        period: 'Cette semaine',
        totalMovements: 1545,
        percentageChange: 12.5,
        trend: 'UP'
      },
      {
        period: 'Ce mois',
        totalMovements: 6250,
        percentageChange: -3.2,
        trend: 'DOWN'
      },
      {
        period: 'Cette année',
        totalMovements: 85000,
        percentageChange: 18.7,
        trend: 'UP'
      }
    ];
  }

  private static getMockDailyMovements(): DailyMovement[] {
    return [
      {
        date: '2025-07-06',
        entries: 120,
        exits: 85,
        adjustments: 10,
        netMovement: 45
      },
      {
        date: '2025-07-07',
        entries: 95,
        exits: 110,
        adjustments: 5,
        netMovement: -20
      },
      {
        date: '2025-07-08',
        entries: 140,
        exits: 95,
        adjustments: 15,
        netMovement: 60
      }
    ];
  }

  private static getMockBeveragePerformance(): BeveragePerformance[] {
    return [
      {
        id: 1,
        name: 'Coca-Cola 500ml',
        totalMovements: 45,
        totalQuantity: 450,
        revenueImpact: 225000,
        rank: 1
      },
      {
        id: 2,
        name: 'Pepsi 330ml',
        totalMovements: 32,
        totalQuantity: 320,
        revenueImpact: 160000,
        rank: 2
      },
      {
        id: 3,
        name: 'Sprite 500ml',
        totalMovements: 28,
        totalQuantity: 280,
        revenueImpact: 140000,
        rank: 3
      }
    ];
  }

  private static getMockInventoryAnalytics(): InventoryAnalytics {
    return {
      stockDistribution: [
        {
          category: 'Coca-Cola',
          percentage: 35,
          value: 875000,
          color: '#ef4444'
        },
        {
          category: 'Pepsi',
          percentage: 25,
          value: 625000,
          color: '#3b82f6'
        },
        {
          category: 'Sprite',
          percentage: 20,
          value: 500000,
          color: '#10b981'
        },
        {
          category: 'Autres',
          percentage: 20,
          value: 500000,
          color: '#f59e0b'
        }
      ],
      expirationTracking: {
        lotsSoonToExpire: [
          {
            id: 1,
            beverageName: 'Coca-Cola 500ml',
            lotNumber: 'LOT-001',
            expirationDate: '2025-07-20',
            quantity: 50,
            daysUntilExpiration: 8,
            value: 25000
          },
          {
            id: 2,
            beverageName: 'Pepsi 330ml',
            lotNumber: 'LOT-002',
            expirationDate: '2025-07-25',
            quantity: 30,
            daysUntilExpiration: 13,
            value: 15000
          }
        ],
        expiredLots: [],
        totalExpiringValue: 40000
      },
      movementAnalysis: {
        mostActiveBeverages: [
          {
            id: 1,
            name: 'Coca-Cola 500ml',
            movementCount: 45,
            lastMovementDate: '2025-07-12',
            activityScore: 95
          },
          {
            id: 2,
            name: 'Pepsi 330ml',
            movementCount: 32,
            lastMovementDate: '2025-07-11',
            activityScore: 85
          }
        ],
        leastActiveBeverages: [
          {
            id: 10,
            name: 'Boisson Énergisante 250ml',
            movementCount: 2,
            lastMovementDate: '2025-07-01',
            activityScore: 15
          },
          {
            id: 11,
            name: 'Thé Glacé 500ml',
            movementCount: 3,
            lastMovementDate: '2025-07-03',
            activityScore: 25
          }
        ],
        seasonalTrends: [
          {
            period: 'Été 2025',
            totalMovements: 2500,
            averageDaily: 35,
            trend: 'UP'
          }
        ]
      }
    };
  }

  private static getMockStockAlerts(): StockAlert[] {
    return [
      {
        id: 1,
        beverageName: 'Fanta Orange 500ml',
        currentStock: 5,
        threshold: 20,
        alertLevel: 'CRITICAL',
        severity: 9
      },
      {
        id: 2,
        beverageName: 'Coca-Cola Zero 330ml',
        currentStock: 15,
        threshold: 30,
        alertLevel: 'LOW',
        severity: 5
      }
    ];
  }

  private static getMockExpirationAlerts(): any {
    return {
      lots: [
        {
          id: 1,
          beverageName: 'Coca-Cola 500ml',
          lotNumber: 'LOT-001',
          expirationDate: '2025-07-20',
          quantity: 50,
          daysUntilExpiration: 8,
          value: 25000
        }
      ]
    };
  }

  private static getMockUserActivity(): UserActivityStats[] {
    return [
      {
        userId: 1,
        userName: 'Admin User',
        totalMovements: 45,
        lastActivity: '2025-07-12',
        activityScore: 95
      },
      {
        userId: 2,
        userName: 'John Doe',
        totalMovements: 32,
        lastActivity: '2025-07-11',
        activityScore: 85
      }
    ];
  }

  private static getMockRevenueMetrics(): RevenueMetrics {
    return {
      totalRevenue: 2500000,
      revenueByPeriod: [
        {
          period: 'Cette semaine',
          revenue: 125000,
          profit: 25000,
          margin: 20
        },
        {
          period: 'Ce mois',
          revenue: 500000,
          profit: 100000,
          margin: 20
        }
      ],
      topRevenueGenerators: [
        {
          beverageId: 1,
          beverageName: 'Coca-Cola 500ml',
          revenue: 225000,
          profit: 45000,
          margin: 20
        }
      ],
      profitMargin: 20
    };
  }

  // Data validation methods
  private static isValidWeeklyStockMovement(data: any): data is WeeklyStockMovement {
    if (!data || typeof data !== 'object') return false;

    // Check required properties
    if (!Array.isArray(data.weekDates) || !Array.isArray(data.datasets)) return false;
    if (typeof data.totalEntries !== 'number' || typeof data.totalExits !== 'number' || typeof data.totalAdjustments !== 'number') return false;

    // Validate weekDates length
    if (data.weekDates.length !== 7) return false;

    // Validate datasets structure
    if (data.datasets.length !== 3) return false;

    for (const dataset of data.datasets) {
      if (!dataset.label || !Array.isArray(dataset.data) || !dataset.movementType || !dataset.color) return false;
      if (dataset.data.length !== 7) return false;
      if (!['ENTREE', 'SORTIE', 'AJUSTEMENT'].includes(dataset.movementType)) return false;
      if (!this.isValidHexColor(dataset.color)) return false;
      if (!dataset.data.every(val => typeof val === 'number' && val >= 0)) return false;
    }

    return true;
  }

  private static isValidMovementTrends(data: any): data is MovementTrend[] {
    if (!Array.isArray(data)) return false;

    for (const trend of data) {
      if (!trend || typeof trend !== 'object') return false;
      if (typeof trend.period !== 'string' || typeof trend.totalMovements !== 'number' || typeof trend.percentageChange !== 'number') return false;
      if (!['UP', 'DOWN', 'STABLE'].includes(trend.trend)) return false;
      if (trend.totalMovements < 0) return false;
    }

    return true;
  }

  private static isValidBeveragePerformance(data: any): data is BeveragePerformance[] {
    if (!Array.isArray(data)) return false;

    for (const beverage of data) {
      if (!beverage || typeof beverage !== 'object') return false;
      if (typeof beverage.id !== 'number' || typeof beverage.name !== 'string') return false;
      if (typeof beverage.totalMovements !== 'number' || typeof beverage.totalQuantity !== 'number') return false;
      if (typeof beverage.rank !== 'number') return false;
      if (beverage.totalMovements < 0 || beverage.totalQuantity < 0 || beverage.rank < 1) return false;
      if (beverage.revenueImpact !== undefined && (typeof beverage.revenueImpact !== 'number' || beverage.revenueImpact < 0)) return false;
    }

    return true;
  }

  private static isValidInventoryAnalytics(data: any): data is InventoryAnalytics {
    if (!data || typeof data !== 'object') return false;

    // Validate stockDistribution
    if (!Array.isArray(data.stockDistribution)) return false;
    for (const item of data.stockDistribution) {
      if (!item || typeof item !== 'object') return false;
      if (typeof item.category !== 'string' || typeof item.percentage !== 'number' || typeof item.value !== 'number') return false;
      if (!this.isValidHexColor(item.color)) return false;
      if (item.percentage < 0 || item.percentage > 100 || item.value < 0) return false;
    }

    // Validate expirationTracking
    if (!data.expirationTracking || typeof data.expirationTracking !== 'object') return false;
    if (!Array.isArray(data.expirationTracking.lotsSoonToExpire)) return false;
    if (!Array.isArray(data.expirationTracking.expiredLots)) return false;
    if (typeof data.expirationTracking.totalExpiringValue !== 'number' || data.expirationTracking.totalExpiringValue < 0) return false;

    // Validate expiring lots
    for (const lot of data.expirationTracking.lotsSoonToExpire) {
      if (!lot || typeof lot !== 'object') return false;
      if (typeof lot.id !== 'number' || typeof lot.beverageName !== 'string' || typeof lot.lotNumber !== 'string') return false;
      if (typeof lot.quantity !== 'number' || typeof lot.daysUntilExpiration !== 'number' || typeof lot.value !== 'number') return false;
      if (!this.isValidDateString(lot.expirationDate)) return false;
      if (lot.quantity < 0 || lot.daysUntilExpiration < 0 || lot.value < 0) return false;
    }

    // Validate movementAnalysis
    if (!data.movementAnalysis || typeof data.movementAnalysis !== 'object') return false;
    if (!Array.isArray(data.movementAnalysis.mostActiveBeverages) || !Array.isArray(data.movementAnalysis.leastActiveBeverages)) return false;
    if (!Array.isArray(data.movementAnalysis.seasonalTrends)) return false;

    // Validate beverage activity data
    const allBeverages = [...data.movementAnalysis.mostActiveBeverages, ...data.movementAnalysis.leastActiveBeverages];
    for (const beverage of allBeverages) {
      if (!beverage || typeof beverage !== 'object') return false;
      if (typeof beverage.id !== 'number' || typeof beverage.name !== 'string') return false;
      if (typeof beverage.movementCount !== 'number' || typeof beverage.activityScore !== 'number') return false;
      if (!this.isValidDateString(beverage.lastMovementDate)) return false;
      if (beverage.movementCount < 0 || beverage.activityScore < 0 || beverage.activityScore > 100) return false;
    }

    return true;
  }

  private static isValidHexColor(color: string): boolean {
    return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);
  }

  private static isValidDateString(dateStr: string): boolean {
    if (typeof dateStr !== 'string') return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr.includes('-');
  }
}
