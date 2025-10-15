# Mock API Controller Documentation

This mock API controller simulates backend API calls and returns responses similar to your JSON data files.

## Features

- ✅ Simulates network delay (500ms default)
- ✅ Returns data in the same format as your JSON files
- ✅ Includes error handling
- ✅ Consistent response structure
- ✅ Multiple endpoint methods

## Response Structure

All API methods return a response object with the following structure:

```javascript
{
  success: boolean,      // true if request succeeded
  data: object | null,   // response data
  error: string | null   // error message if failed
}
```

## Available Methods

### 1. `getDashboard(dashboardId)`

Get dashboard configuration by ID.

**Parameters:**
- `dashboardId` (string): Dashboard identifier

**Returns:**
```javascript
{
  success: true,
  data: {
    dashboardConfig: {
      dashboardId: "dashboard123",
      config: {
        sections: [...]
      }
    }
  }
}
```

**Usage:**
```javascript
const response = await apiController.getDashboard('dashboard123');
if (response.success) {
  console.log(response.data.dashboardConfig);
}
```

---

### 2. `getDefinitions()`

Get all widget/table definitions.

**Returns:**
```javascript
{
  success: true,
  data: {
    definitions: [
      {
        definitionId: "financial_overview",
        queryDefinition: {...},
        config: {...}
      },
      ...
    ]
  }
}
```

**Usage:**
```javascript
const response = await apiController.getDefinitions();
if (response.success) {
  console.log(response.data.definitions);
}
```

---

### 3. `getDefinitionById(definitionId)`

Get a specific definition by ID.

**Parameters:**
- `definitionId` (string): Definition identifier

**Returns:**
```javascript
{
  success: true,
  data: {
    definitionId: "financial_overview",
    queryDefinition: {...},
    config: {
      widgets: [...]
    }
  }
}
```

**Usage:**
```javascript
const response = await apiController.getDefinitionById('financial_overview');
if (response.success) {
  console.log(response.data);
}
```

---

### 4. `executeQuery(definitionId, params)`

Execute a query and get results.

**Parameters:**
- `definitionId` (string): Definition identifier
- `params` (object): Query parameters (optional)

**Returns:**
```javascript
{
  success: true,
  data: {
    financial_overview: {
      query_result: {
        a: 1250000,
        a_trend: 9.8,
        b: 840000,
        ...
      }
    }
  }
}
```

**Usage:**
```javascript
const response = await apiController.executeQuery('financial_overview', {
  dateParam: '2024-01-01'
});
if (response.success) {
  console.log(response.data);
}
```

---

### 5. `getAllQueryResults()`

Get all query results (response metadata).

**Returns:**
```javascript
{
  success: true,
  data: [
    { financial_overview: { query_result: {...} } },
    { key_business_metrics: { query_result: {...} } },
    { top_instruments: { query_result: {...} } }
  ]
}
```

**Usage:**
```javascript
const response = await apiController.getAllQueryResults();
if (response.success) {
  console.log(response.data);
}
```

---

### 6. `getCompleteDashboardData(dashboardId)`

Get complete dashboard data (dashboard + definitions + results) in one call.

**Parameters:**
- `dashboardId` (string): Dashboard identifier

**Returns:**
```javascript
{
  success: true,
  data: {
    dashboard: {
      dashboardConfig: {...}
    },
    definitions: {
      definitions: [...]
    },
    queryResults: [...]
  }
}
```

**Usage:**
```javascript
const response = await apiController.getCompleteDashboardData('dashboard123');
if (response.success) {
  const { dashboard, definitions, queryResults } = response.data;
  // Use all data together
}
```

---

## React Component Example

```javascript
import { useState, useEffect } from 'react';
import apiController from './apiService/apiController';

function DashboardComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get complete dashboard data
        const response = await apiController.getCompleteDashboardData('dashboard123');
        
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {/* Render dashboard using data */}
    </div>
  );
}
```

---

## Error Handling

All methods handle errors gracefully:

```javascript
const response = await apiController.getDashboard('invalid_id');

if (!response.success) {
  console.error(response.error);
  // Output: "Dashboard with ID "invalid_id" not found"
}
```

---

## Network Delay

The mock API includes a configurable delay to simulate network latency:

- Default delay: 500ms
- Complete dashboard data: 800ms (slightly longer)

This helps test loading states and async behavior in your application.

---

## Data Available

The mock API contains data for:

### Dashboards:
- `dashboard123`

### Definitions:
- `financial_overview`
- `key_business_metrics`
- `top_instruments`

### Query Results:
- Financial overview metrics (with trend data)
- Key business metrics
- Top instruments table data

---

## Migration to Real API

When you're ready to switch to a real backend API, simply:

1. Keep the same method signatures
2. Replace mock data with real API endpoints
3. Update the base URL and authentication
4. Your components won't need changes (same interface)

Example:
```javascript
const apiController = {
  getDashboard: async (dashboardId) => {
    const response = await fetch(`/api/dashboards/${dashboardId}`);
    const data = await response.json();
    return {
      success: response.ok,
      data: response.ok ? data : null,
      error: response.ok ? null : data.message
    };
  },
  // ... other methods
};
```

