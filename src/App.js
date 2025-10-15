import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Section from './components/metrics_section/section';
import { SectionTypes } from './constants/sectionTypes';
import dashboardMetaData from './data/dashboardMetaData.json';
import definitionsMetaData from './data/definitionsMetaData.json';
import responseMetaData from './data/responseMetaData.json';
import './App.css';

function App() {
  const [masterData, setMasterData] = useState([]);

  // Process data on component mount
  useEffect(() => {
    processData();
  }, []);

  const processData = () => {
    // Get sections from dashboardMetaData
    const sections = dashboardMetaData.dashboardConfig.config.sections;
    
    // Process each section
    const processedSections = sections.map(section => {
      const definitionId = section.definitionId;
      
      // Find definition in definitionsMetaData
      const definition = definitionsMetaData.definitions.find(def => def.definitionId === definitionId);
      
      // Find response data
      const responseData = responseMetaData.find(resp => resp[definitionId]);
      
      // Get enabled widgets from section config
      const enabledWidgets = section.config?.enabled || [];
      
      // Process widgets based on definition and response
      let processedWidgets = [];
      let tableData = [];
      let tableColumns = [];
      
      if (section.typeId === SectionTypes.TABLE) {
        // Handle table data for table type
        if (responseData && responseData[definitionId]?.query_result?.data) {
          tableData = responseData[definitionId].query_result.data;
        }
        
        // Get ALL available columns from definition
        const allColumns = definition?.config?.columns || [];
        
        // Filter columns based on dashboardMetaData.json enabled config
        const enabledColumnKeys = section.config?.enabled || [];
        tableColumns = allColumns.filter(col => enabledColumnKeys.includes(col.key));
      } else {
        // Handle widget data for other typeIds
        processedWidgets = definition?.config?.widgets?.map(widget => {
          const isEnabled = enabledWidgets.includes(widget.widgetId);
          let value = '--';
          let trendValue = null;
          
          // Get value from response data
          if (responseData && responseData[definitionId]?.query_result) {
            const queryResult = responseData[definitionId].query_result;

            const valuePath = widget.valueDefinition.replace('query_result.', '');
            value = queryResult[valuePath] || '--';
            
            const trendPath = widget.config?.trend?.valueDefinition.replace('query_result.', '');
            trendValue = queryResult[trendPath];
            
            // Format value based on widget config
                value = `${value?.toLocaleString()}`;
          }
          
          // Format trend value for display
          let changeDisplay = null;
          if (trendValue !== null && trendValue !== undefined) {
  
            changeDisplay = `${trendValue}%`;
          }
          
          return {
            id: widget.widgetId,
            label: widget.label,
            enabled: isEnabled,
            value: value,
            change: changeDisplay,
            trendValue: trendValue,
            category: definitionId,
            type: widget.config?.unit || 'number',
            color: widget.config?.color || '#1976d2',
            trendColors: widget.config?.trend ? {
              positive: widget.config.trend.positiveColor || '#00ff00',
              negative: widget.config.trend.negativeColor || '#ff0000',
              neutral: widget.config.trend.neutralColor || '#FFFF00'
            } : null
          };
        }) || [];
      }
      
      return {
        sectionId: section.sectionId,
        definitionId: definitionId,
        label: section.label,
        typeId: section.typeId,
        widgets: processedWidgets,
        tableData: tableData,
        tableColumns: tableColumns,
        tableRowLimit: section.tableRowLimit || 5
      };
    });
    
    setMasterData(processedSections);
  };

  const handleSaveConfig = (sectionId, newData) => {
    // Update the specific section's data
    setMasterData(prevData => 
      prevData.map(section => {
        if (section.sectionId === sectionId) {
          if (section.typeId === SectionTypes.TABLE) {
            // For table sections, update the table columns and row limit
            return {
              ...section,
              tableColumns: newData.allColumns.filter(col => 
                newData.enabledColumns.includes(col.key)
              ),
              tableData: section.tableData, // Keep existing data
              tableRowLimit: newData.tableRowLimit
            };
          } else {
            // For metric sections, update the widgets
            return { ...section, widgets: newData };
          }
        }
        return section;
      })
    );
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
          Dashboard POC
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dynamic metrics configuration and display system
        </Typography>
      </Box>

      {/* Render sections based on masterData */}
      {masterData.map((section, index) => {
        const definitionData = definitionsMetaData.definitions.find(def => def.definitionId === section.definitionId);
        const responseData = responseMetaData.find(resp => resp[section.definitionId]);
        
        return (
          <Section
            key={section.sectionId}
            section={section}
            definitionData={definitionData}
            responseData={responseData}
            onSave={handleSaveConfig}
          />
        );
      })}
    </Container>
  );
}

export default App;
