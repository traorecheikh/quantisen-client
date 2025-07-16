# Backend API Fixes Required - Analytics Statistics

## Critical Issues Found

Based on the frontend logs, the backend is returning data that doesn't match the expected format. Here are the specific fixes needed:

## 1. Weekly Stock Movement Data (`GET /statistics/weekly-stock-movement`)

### Current Backend Response (INCORRECT):
```json
{
  "datasets": [
    {
      "data": [0, 0, 0, 0, 0, 0, 0],
      "label": "Entries"
    },
    {
      "data": [0, 0, 0, 0, 0, 0, 0],
      "label": "Exits"
    },
    {
      "data": [0, 0, 0, 0, 0, 0, 0],
      "label": "Adjustments"
    }
  ],
  "totalAdjustments": 0,
  "totalEntries": 0,
  "totalExits": 0,
  "weekDates": ["2025-07-06", "2025-07-07", "2025-07-08", "2025-07-09", "2025-07-10", "2025-07-11", "2025-07-12"]
}
```

### Required Backend Response (CORRECT):
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

### Backend Changes Required:
1. **Fix weekDates**: Return day names in French, not ISO dates
2. **Add missing fields**: Each dataset needs `movementType` and `color` fields
3. **Fix labels**: Use French labels ("Entrées", "Sorties", "Ajustements")
4. **Add colors**: Use the exact hex colors specified

## 2. Inventory Analytics Data (`GET /statistics/inventory-analytics`)

### Current Backend Response (INCORRECT):
```json
""
```

### Required Backend Response (CORRECT):
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

### Backend Changes Required:
1. **Return proper JSON object**: Currently returning empty string
2. **Implement all required sections**: stockDistribution, expirationTracking, movementAnalysis
3. **Calculate percentages**: stockDistribution percentages should sum to ~100
4. **Add color codes**: Use valid hex colors for chart display

## 3. Backend Implementation Steps

### Step 1: Fix Weekly Stock Movement Endpoint
```python
# Example for Python/Django - adapt to your framework
def get_weekly_stock_movement(request):
    # Get movements for the last 7 days
    movements = Movement.objects.filter(
        date__gte=timezone.now() - timedelta(days=7)
    )
    
    # Group by day and movement type
    daily_data = {}
    for i in range(7):
        date = timezone.now() - timedelta(days=6-i)
        day_name = get_french_day_name(date.weekday())  # "Lundi", "Mardi", etc.
        daily_data[day_name] = {
            'ENTREE': 0,
            'SORTIE': 0, 
            'AJUSTEMENT': 0
        }
    
    # Aggregate movement data
    for movement in movements:
        day_name = get_french_day_name(movement.date.weekday())
        daily_data[day_name][movement.movement_type] += movement.quantity
    
    # Build response
    return JsonResponse({
        "weekDates": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
        "datasets": [
            {
                "label": "Entrées",
                "data": [daily_data[day]['ENTREE'] for day in daily_data.keys()],
                "movementType": "ENTREE",
                "color": "#10b981"
            },
            {
                "label": "Sorties",
                "data": [daily_data[day]['SORTIE'] for day in daily_data.keys()],
                "movementType": "SORTIE", 
                "color": "#ef4444"
            },
            {
                "label": "Ajustements",
                "data": [daily_data[day]['AJUSTEMENT'] for day in daily_data.keys()],
                "movementType": "AJUSTEMENT",
                "color": "#f59e0b"
            }
        ],
        "totalEntries": sum(daily_data[day]['ENTREE'] for day in daily_data.keys()),
        "totalExits": sum(daily_data[day]['SORTIE'] for day in daily_data.keys()),
        "totalAdjustments": sum(daily_data[day]['AJUSTEMENT'] for day in daily_data.keys())
    })
```

### Step 2: Fix Inventory Analytics Endpoint
```python
def get_inventory_analytics(request):
    # Calculate stock distribution
    stock_distribution = []
    total_value = 0
    
    # Group by beverage category
    categories = Beverage.objects.values('category').annotate(
        total_value=Sum('stock__quantity') * F('price')
    )
    
    for category in categories:
        total_value += category['total_value']
    
    colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
    for i, category in enumerate(categories):
        percentage = (category['total_value'] / total_value) * 100 if total_value > 0 else 0
        stock_distribution.append({
            'category': category['category'],
            'percentage': round(percentage, 1),
            'value': category['total_value'],
            'color': colors[i % len(colors)]
        })
    
    # Calculate expiration tracking
    lots_soon_to_expire = []
    expired_lots = []
    total_expiring_value = 0
    
    for lot in Lot.objects.filter(expiration_date__gte=timezone.now()):
        days_until_expiration = (lot.expiration_date - timezone.now().date()).days
        if days_until_expiration <= 30:  # Soon to expire
            lots_soon_to_expire.append({
                'id': lot.id,
                'beverageName': lot.beverage.name,
                'lotNumber': lot.lot_number,
                'expirationDate': lot.expiration_date.isoformat(),
                'quantity': lot.quantity,
                'daysUntilExpiration': days_until_expiration,
                'value': lot.quantity * lot.beverage.price
            })
            total_expiring_value += lot.quantity * lot.beverage.price
    
    # Build complete response
    return JsonResponse({
        'stockDistribution': stock_distribution,
        'expirationTracking': {
            'lotsSoonToExpire': lots_soon_to_expire,
            'expiredLots': expired_lots,
            'totalExpiringValue': total_expiring_value
        },
        'movementAnalysis': {
            'mostActiveBeverages': get_most_active_beverages(),
            'leastActiveBeverages': get_least_active_beverages(),
            'seasonalTrends': get_seasonal_trends()
        }
    })
```

## 4. Data Validation Checklist

Before deploying, ensure your backend responses meet these requirements:

### Weekly Stock Movement:
- [ ] `weekDates` array has exactly 7 French day names
- [ ] `datasets` array has exactly 3 objects
- [ ] Each dataset has `label`, `data`, `movementType`, and `color` fields
- [ ] `data` arrays have exactly 7 numbers each
- [ ] Colors are valid hex codes (#rrggbb)
- [ ] Totals match the sum of respective data arrays

### Inventory Analytics:
- [ ] Returns proper JSON object (not empty string)
- [ ] `stockDistribution` percentages sum to ~100
- [ ] All colors are valid hex codes
- [ ] `expirationDate` fields are ISO date strings (YYYY-MM-DD)
- [ ] `activityScore` values are between 0-100
- [ ] All numeric values are non-negative

### Movement Trends:
- [ ] `trend` values are exactly "UP", "DOWN", or "STABLE"
- [ ] `totalMovements` are non-negative integers
- [ ] `percentageChange` can be negative for decreases

## 5. Testing Commands

Test your endpoints with these curl commands:

```bash
# Test weekly stock movement
curl -X GET "http://your-backend/statistics/weekly-stock-movement" \
  -H "Content-Type: application/json"

# Test inventory analytics
curl -X GET "http://your-backend/statistics/inventory-analytics" \
  -H "Content-Type: application/json"

# Test movement trends
curl -X GET "http://your-backend/statistics/movement-trends?period=weekly" \
  -H "Content-Type: application/json"
```

## 6. Priority Order

Fix in this order:
1. **Inventory Analytics** (currently returning empty string)
2. **Weekly Stock Movement** (missing required fields)
3. **Movement Trends** (mostly working, minor validation)
4. **Beverage Performance** (working but returns empty array)

Once these fixes are implemented, the frontend will stop using mock data and display real statistics from your backend.
