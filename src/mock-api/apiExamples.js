/**
 * API Controller Usage Examples
 * 
 * This file demonstrates how to use the mock API controller
 */

import apiController from './apiController';

// Example 1: Get Dashboard Configuration
export const exampleGetDashboard = async () => {
  try {
    const response = await apiController.getDashboard('dashboard123');
    
    if (response.success) {
      console.log('Dashboard Data:', response.data);
      // Returns: { dashboardConfig: { dashboardId, config: { sections: [...] } } }
    } else {
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 2: Get All Definitions
export const exampleGetDefinitions = async () => {
  try {
    const response = await apiController.getDefinitions();
    
    if (response.success) {
      console.log('Definitions:', response.data);
      // Returns: { definitions: [...] }
    } else {
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 3: Get Specific Definition
export const exampleGetDefinitionById = async () => {
  try {
    const response = await apiController.getDefinitionById('financial_overview');
    
    if (response.success) {
      console.log('Definition:', response.data);
      // Returns: { definitionId, queryDefinition, config }
    } else {
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 4: Execute Query
export const exampleExecuteQuery = async () => {
  try {
    const response = await apiController.executeQuery('financial_overview', {
      dateParam: '2024-01-01'
    });
    
    if (response.success) {
      console.log('Query Results:', response.data);
      // Returns: { financial_overview: { query_result: { a: 1250000, ... } } }
    } else {
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 5: Get All Query Results
export const exampleGetAllQueryResults = async () => {
  try {
    const response = await apiController.getAllQueryResults();
    
    if (response.success) {
      console.log('All Query Results:', response.data);
      // Returns: [{ financial_overview: {...} }, { key_business_metrics: {...} }, ...]
    } else {
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 6: Get Complete Dashboard Data (Dashboard + Definitions + Results)
export const exampleGetCompleteDashboardData = async () => {
  try {
    const response = await apiController.getCompleteDashboardData('dashboard123');
    
    if (response.success) {
      console.log('Complete Dashboard Data:', response.data);
      // Returns: { 
      //   dashboard: {...}, 
      //   definitions: {...}, 
      //   queryResults: [...] 
      // }
    } else {
      console.error('Error:', response.error);
    }
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Example 7: Using in a React Component
export const exampleReactComponentUsage = () => {
  /*
  import { useState, useEffect } from 'react';
  import apiController from './apiService/apiController';
  
  function MyComponent() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await apiController.getCompleteDashboardData('dashboard123');
          
          if (response.success) {
            setDashboardData(response.data);
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
    
    return <div>{JSON.stringify(dashboardData)}</div>;
  }
  */
};

