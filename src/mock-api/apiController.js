// Import JSON data files
import dashboardMetaData from '../data/dashboardMetaData.json';
import definitionsMetaData from '../data/definitionsMetaData.json';
import responseMetaData from '../data/responseMetaData.json';

// Mock API delay to simulate network request
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// API Controller with different endpoints
const apiController = {
  // Get dashboard configuration by ID
  getDashboard: async (dashboardId) => {
    await mockDelay();
    
    if (dashboardMetaData.dashboardConfig.dashboardId === dashboardId) {
      return {
        success: true,
        data: dashboardMetaData
      };
    }
    
    return {
      success: false,
      error: `Dashboard with ID "${dashboardId}" not found`,
      data: null
    };
  },
  
  // Get all definitions
  getDefinitions: async () => {
    await mockDelay();
    
    return {
      success: true,
      data: definitionsMetaData
    };
  },
  
  // Get definition by ID
  getDefinitionById: async (definitionId) => {
    await mockDelay();
    
    const definition = definitionsMetaData.definitions.find(
      def => def.definitionId === definitionId
    );
    
    if (!definition) {
      return {
        success: false,
        error: `Definition with ID "${definitionId}" not found`,
        data: null
      };
    }
    
    return {
      success: true,
      data: definition
    };
  },
  
  // Get query results by definition ID
  getQueryResults: async (definitionId) => {
    await mockDelay();
    
    const result = responseMetaData.find(item => item[definitionId]);
    
    if (!result) {
      return {
        success: false,
        error: `No query results found for definition "${definitionId}"`,
        data: null
      };
    }
    
    return {
      success: true,
      data: result
    };
  },
  
  // Get all query results (response metadata)
  getAllQueryResults: async () => {
    await mockDelay();
    
    return {
      success: true,
      data: responseMetaData
    };
  },
  
  // Get complete dashboard data (dashboard + definitions + results)
  getCompleteDashboardData: async (dashboardId) => {
    await mockDelay(800);
    
    if (dashboardMetaData.dashboardConfig.dashboardId !== dashboardId) {
      return {
        success: false,
        error: `Dashboard with ID "${dashboardId}" not found`,
        data: null
      };
    }
    
    return {
      success: true,
      data: {
        dashboard: dashboardMetaData,
        definitions: definitionsMetaData,
        queryResults: responseMetaData
      }
    };
  }
};

export default apiController;
