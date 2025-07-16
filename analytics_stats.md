# Analytics Page Statistics Documentation

This document provides detailed specifications for the Analytics Page statistics endpoints and data structures. This ensures the backend implementation will be perfectly compatible with the frontend.

## Analytics Page Overview

The Analytics Page is a comprehensive statistics dashboard that displays:
- Movement trends summary cards
- Interactive stock movement charts
- Top performing beverages ranking
- Inventory analytics with distribution charts
- Expiration alerts and tracking
- Movement analysis with activity scores
- Export functionality (PDF, Excel)

## Required Backend Endpoints

### 1. Weekly Stock Movement Data
**Endpoint**: `GET /statistics/weekly-stock-movement`

**Purpose**: Provides data for the main interactive chart showing stock movements over time.

**Response Model**:
```json
{
  "weekDates": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
  "datasets": [
    {
      "label": "Entrées",
      "data": [120, 95, 140, 80, 110, 160, 90],
      "movementType": "ENTREE",
      "color": "#10b981"
    },
    {
      "label": "Sorties", 
      "data": [85, 110, 95, 125, 90, 75, 105],
      "movementType": "SORTIE",
      "color": "#ef4444"
    },
    {
      "label": "Ajustements",
      "data": [10, 5, 15, 8, 12, 6, 9],
      "movementType": "AJUSTEMENT", 
      "color": "#f59e0b"
    }
  ],
  "totalEntries": 795,
  "totalExits": 685,
  "totalAdjustments": 65
}
```

**Requirements**:
- `weekDates`: Array of 7 strings (day names in French)
- `datasets`: Array of exactly 3 objects (ENTREE, SORTIE, AJUSTEMENT)
- `data`: Array of 7 numbers matching the weekDates length
- `color`: Valid hex color codes for chart display
- Totals must match sum of respective data arrays

### 2. Movement Trends Analysis
**Endpoint**: `GET /statistics/movement-trends?period={period}`

**Parameters**: 
- `period`: "weekly" | "monthly" | "yearly"

**Purpose**: Displays trend cards showing movement statistics with percentage changes.

**Response Model**:
```json
[
  {
    "period": "Cette semaine",
    "totalMovements": 1545,
    "percentageChange": 12.5,
    "trend": "UP"
  },
  {
    "period": "Ce mois", 
    "totalMovements": 6250,
    "percentageChange": -3.2,
    "trend": "DOWN"
  },
  {
    "period": "Cette année",
    "totalMovements": 85000,
    "percentageChange": 18.7,
    "trend": "UP"
  }
]
```

**Requirements**:
- `period`: French text describing the time period
- `totalMovements`: Positive integer
- `percentageChange`: Number (can be negative for decreases)
- `trend`: Must be exactly "UP", "DOWN", or "STABLE"

### 3. Beverage Performance Ranking
**Endpoint**: `GET /statistics/beverage-performance`

**Purpose**: Shows top performing beverages with ranking and progress indicators.

**Response Model**:
```json
[
  {
    "id": 1,
    "name": "Coca-Cola 500ml",
    "totalMovements": 45,
    "totalQuantity": 450,
    "revenueImpact": 225000,
    "rank": 1
  },
  {
    "id": 2,
    "name": "Pepsi 330ml", 
    "totalMovements": 32,
    "totalQuantity": 320,
    "revenueImpact": 160000,
    "rank": 2
  }
]
```

**Requirements**:
- Array sorted by rank (1 = best performing)
- `id`: Unique beverage identifier
- `name`: Display name for the beverage
- `totalMovements`: Non-negative integer
- `totalQuantity`: Non-negative integer  
- `revenueImpact`: Optional positive number (in XOF currency)
- `rank`: Sequential ranking starting from 1

### 4. Inventory Analytics
**Endpoint**: `GET /statistics/inventory-analytics`

**Purpose**: Comprehensive inventory analysis including distribution, expiration tracking, and movement analysis.

**Response Model**:
```json
{
  "stockDistribution": [
    {
      "category": "Coca-Cola",
      "percentage": 35,
      "value": 875000,
      "color": "#ef4444"
    },
    {
      "category": "Pepsi",
      "percentage": 25, 
      "value": 625000,
      "color": "#3b82f6"
    }
  ],
  "expirationTracking": {
    "lotsSoonToExpire": [
      {
        "id": 1,
        "beverageName": "Coca-Cola 500ml",
        "lotNumber": "LOT-001",
        "expirationDate": "2025-07-20",
        "quantity": 50,
        "daysUntilExpiration": 8,
        "value": 25000
      }
    ],
    "expiredLots": [],
    "totalExpiringValue": 40000
  },
  "movementAnalysis": {
    "mostActiveBeverages": [
      {
        "id": 1,
        "name": "Coca-Cola 500ml",
        "movementCount": 45,
        "lastMovementDate": "2025-07-12",
        "activityScore": 95
      }
    ],
    "leastActiveBeverages": [
      {
        "id": 10,
        "name": "Boisson Énergisante 250ml",
        "movementCount": 2, 
        "lastMovementDate": "2025-07-01",
        "activityScore": 15
      }
    ],
    "seasonalTrends": [
      {
        "period": "Été 2025",
        "totalMovements": 2500,
        "averageDaily": 35,
        "trend": "UP"
      }
    ]
  }
}
```

**Requirements**:
- **stockDistribution**: 
  - `percentage`: Numbers that should sum to 100
  - `value`: Positive numbers in XOF currency
  - `color`: Valid hex color codes
- **expirationTracking**:
  - `expirationDate`: ISO date string (YYYY-MM-DD)
  - `daysUntilExpiration`: Non-negative integer
  - `lotNumber`: Unique lot identifier
- **movementAnalysis**:
  - `activityScore`: Integer between 0-100
  - `lastMovementDate`: ISO date string
  - `trend`: "UP", "DOWN", or "STABLE"

## Export Endpoints

### PDF Export
**Endpoint**: `GET /statistics/export/pdf?type={type}`

**Parameters**:
- `type`: "dashboard" | "analytics" | "inventory"

**Response**: Binary PDF file

### Excel Export  
**Endpoint**: `GET /statistics/export/excel?type={type}`

**Parameters**:
- `type`: "movements" | "inventory" | "performance"

**Response**: Binary Excel file (.xlsx)

## Data Validation Requirements

### Critical Validations
1. **Array Lengths**: weekDates and data arrays must have same length
2. **Color Codes**: Must be valid hex colors (#rrggbb format)
3. **Trend Values**: Must be exactly "UP", "DOWN", or "STABLE"
4. **Percentages**: stockDistribution percentages should sum to ~100
5. **Dates**: Must be valid ISO date strings
6. **Non-negative Numbers**: Quantities, movements, values must be ≥ 0

### Error Handling
If backend returns invalid data, frontend will:
1. Log detailed error information
2. Show French error message to user
3. Fall back to realistic mock data
4. Allow user to retry the request

### Empty Data Scenarios
Backend should handle these cases gracefully:
- **No movements**: Return empty arrays with totals = 0
- **No beverages**: Return empty performance array
- **No expiring lots**: Return empty lotsSoonToExpire array
- **No analytics data**: Return null/empty objects for optional fields

## Frontend Chart Integration

### Chart.js Requirements
- Line charts need `labels` and `datasets` arrays
- Pie charts need `labels` and single dataset with `data` array
- Colors must be valid CSS hex codes
- Data arrays must contain only numbers

### Responsive Behavior
- Charts resize automatically on window resize
- Mobile breakpoints hide complex tooltips
- Legend positions adjust based on screen size

## Performance Considerations

### Caching Recommendations
- Cache dashboard data for 1 minute
- Cache analytics data for 5 minutes  
- Cache export data for 10 minutes
- Use ETags for conditional requests

### Data Size Limits
- Maximum 100 beverages in performance ranking
- Maximum 50 expiring lots to display
- Limit seasonal trends to last 12 periods
- Chart data points should not exceed 365 days

## Testing Scenarios

### Valid Data Tests
1. Full dataset with all fields populated
2. Minimum viable data (empty arrays where allowed)
3. Edge cases (zero values, same dates)

### Invalid Data Tests  
1. Missing required fields
2. Invalid date formats
3. Negative quantities
4. Invalid trend values
5. Malformed color codes

### Network Error Tests
1. 500 server errors
2. Timeout scenarios  
3. Network connectivity issues
4. Partial response data

This specification ensures perfect compatibility between the frontend Analytics Page and backend implementation, with robust error handling and graceful fallbacks.
