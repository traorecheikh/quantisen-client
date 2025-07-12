# Statistics and Analytics Features Documentation

This document compiles all the statistical data display features found in the Gestion Boisson application. This information will help the backend AI understand what statistics endpoints and data structures are needed.

## Dashboard Statistics

### Overview Cards
The dashboard displays key metrics in card format:
- **Total Beverages**: Count of all active beverages in the system
- **Total Stock**: Sum of all available quantities across all beverages
- **Low Stock Alerts**: Number of beverages below their threshold
- **Total Movements**: Count of all stock movements (entries, exits, adjustments)
- **Total Users**: Count of active users in the system
- **Total Value**: Monetary value of current inventory

### Recent Activities
- **Recent Movements**: List of latest 10 stock movements with:
  - Beverage name
  - Movement type (ENTREE/SORTIE/AJUSTEMENT)
  - Quantity moved
  - Date and time
  - User who performed the action

### Stock Alerts
- **Low Stock Items**: Beverages with quantity below threshold
- **Critical Stock Items**: Beverages with very low quantities
- **Out of Stock Items**: Beverages with zero quantity
- Each alert shows:
  - Beverage name
  - Current stock level
  - Threshold level
  - Alert severity level

## Analytics Page Statistics

### Weekly Stock Movement Chart
- **Chart Type**: Line/Bar chart showing movement trends
- **Data Points**: 
  - Daily entries (ENTREE movements)
  - Daily exits (SORTIE movements)
  - Daily adjustments (AJUSTEMENT movements)
- **Time Period**: Last 7 days by default
- **Interactive Features**:
  - Hover tooltips showing exact values
  - Legend to toggle movement types
  - Date range selector

### Movement Trends
- **Period Analysis**: Weekly, Monthly, Yearly trends
- **Metrics**:
  - Total movements per period
  - Percentage change from previous period
  - Trend direction (UP/DOWN/STABLE)
- **Visual Indicators**: 
  - Green arrows for positive trends
  - Red arrows for negative trends
  - Flat indicators for stable trends

### Top Performing Beverages
- **Ranking**: Beverages by movement frequency
- **Metrics**:
  - Total number of movements
  - Total quantity moved
  - Revenue impact (if applicable)
- **Display**: Top 10 beverages list with progress bars

### Inventory Analytics
- **Stock Distribution**: 
  - Pie chart showing stock levels by beverage category
  - Percentage breakdown of inventory value
- **Expiration Tracking**:
  - Lots expiring soon (within 30 days)
  - Expired lots requiring attention
- **Movement Analysis**:
  - Most active beverages
  - Least active beverages
  - Seasonal trends (if date range allows)

## Required Backend Endpoints

Based on the frontend requirements, the backend should provide:

### Core Statistics Endpoints
1. `GET /statistics/dashboard` - Dashboard overview statistics
2. `GET /statistics/weekly-stock-movement` - Weekly movement data for charts
3. `GET /statistics/movement-trends?period={period}` - Trend analysis
4. `GET /statistics/daily-movements?start={start}&end={end}` - Daily movement data
5. `GET /statistics/beverage-performance` - Top performing beverages
6. `GET /statistics/inventory-analytics` - Inventory distribution and analysis

### Additional Analytics Endpoints
1. `GET /statistics/stock-alerts` - Low stock and critical alerts
2. `GET /statistics/expiration-alerts` - Lots expiring soon
3. `GET /statistics/user-activity` - User activity statistics
4. `GET /statistics/revenue-metrics` - Revenue-related statistics (if applicable)

## Data Models Required

### DashboardStatistics
```typescript
{
  totalBeverages: number;
  totalStock: number;
  lowStockAlerts: number;
  totalMovements: number;
  totalUsers: number;
  totalValue: number;
  recentMovements: RecentMovement[];
  topBeverages: TopBeverage[];
  stockAlerts: StockAlert[];
}
```

### WeeklyStockMovement
```typescript
{
  weekDates: string[];
  datasets: WeeklyDataset[];
  totalEntries: number;
  totalExits: number;
  totalAdjustments: number;
}
```

### MovementTrend
```typescript
{
  period: string;
  totalMovements: number;
  percentageChange: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}
```

## Chart Libraries and Visualization

The frontend uses:
- **Chart.js** or **ApexCharts** for interactive charts
- **Vue components** for data visualization
- **Responsive design** for mobile compatibility

## Real-time Updates

Some statistics may need real-time updates:
- **Dashboard cards**: Update every 30 seconds
- **Recent movements**: Real-time updates via WebSocket (optional)
- **Stock alerts**: Immediate updates when stock changes

## Export Features

Statistics can be exported in multiple formats:
- **PDF reports**: Dashboard summaries
- **Excel files**: Detailed movement data
- **CSV files**: Raw data for external analysis

This documentation provides a comprehensive view of all statistical features that need backend support.
