import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { SectionTypes } from '../../constants/sectionTypes';
import TableDisplay from './tableDisplay';
import MetricDisplay from './metricDisplay';
import TableConfig from './tableConfig';
import MetricConfig from './metricConfig';

const Section = ({ 
  section,
  definitionData,
  responseData,
  onSave
}) => {
  const [configOpen, setConfigOpen] = useState(false);

  // 1. LABEL - Section title
  const renderLabel = () => {
    return (
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
        {section.label}
      </Typography>
    );
  };

  // 2. BUTTON - Config button based on typeId
  const renderConfigButton = () => {
    return (
      <Button
        variant="outlined"
        startIcon={<SettingsIcon />}
        onClick={() => setConfigOpen(true)}
        size="small"
        sx={{
          borderColor: '#1976d2',
          color: '#1976d2',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        }}
      >
        Configure
      </Button>
    );
  };

  // 2.5. STATUS LABEL - Shows count of enabled items
  const renderStatusLabel = () => {
    if (section.typeId === SectionTypes.METRIC) {
      const enabledCount = section.widgets?.filter(w => w.enabled).length || 0;
      const totalCount = section.widgets?.length || 0;
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Showing {enabledCount} of {totalCount} available metrics
        </Typography>
      );
    } else if (section.typeId === SectionTypes.TABLE) {
      const enabledCount = section.tableColumns?.length || 0;
      const totalCount = definitionData?.config?.columns?.length || 0;
      return (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Showing {enabledCount} of {totalCount} available columns
        </Typography>
      );
    }
    return null;
  };

  // 3. DISPLAY - Display component based on typeId
  const renderDisplay = () => {
    if (section.typeId === SectionTypes.TABLE) {
      return (
        <TableDisplay
          data={section.tableData}
          columns={section.tableColumns}
          rowLimit={section.tableRowLimit}
        />
      );
    } else {
      return (
        <MetricDisplay
          metrics={section.widgets}
        />
      );
    }
  };

  // Config handlers
  const handleSaveConfig = (newData) => {
    onSave(section.sectionId, newData);
    setConfigOpen(false);
  };

  const handleCloseConfig = () => {
    setConfigOpen(false);
  };

  const getConfigTitle = () => {
    return `${section.label} Configuration`;
  };

  const getConfigSubtitle = () => {
    if (section.typeId === SectionTypes.METRIC) {
      const enabledCount = section.widgets?.filter(w => w.enabled).length || 0;
      const totalCount = section.widgets?.length || 0;
      return `Showing ${enabledCount} of ${totalCount} available metrics`;
    } else if (section.typeId === SectionTypes.TABLE) {
      const enabledCount = section.tableColumns?.length || 0;
      const totalCount = definitionData?.config?.columns?.length || 0;
      return `Showing ${enabledCount} of ${totalCount} available columns`;
    }
    return "Configure section settings";
  };

  // Render appropriate config component based on typeId
  const renderConfig = () => {
    if (section.typeId === SectionTypes.TABLE) {
      return (
        <TableConfig
          open={configOpen}
          onClose={handleCloseConfig}
          onSave={handleSaveConfig}
          title={getConfigTitle()}
          subtitle={getConfigSubtitle()}
          currentSection={section}
          definitionData={definitionData}
          responseData={responseData}
        />
      );
    } else {
      return (
        <MetricConfig
          open={configOpen}
          onClose={handleCloseConfig}
          onSave={handleSaveConfig}
          title={getConfigTitle()}
          subtitle={getConfigSubtitle()}
          currentSection={section}
          definitionData={definitionData}
          responseData={responseData}
        />
      );
    }
  };

  return (
    <Box sx={{ 
      mb: 4,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
      p: 3
    }}>
      {/* 1. LABEL & BUTTON - Same line */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        {renderLabel()}
        {renderConfigButton()}
      </Box>
      
      {/* 2. DISPLAY */}
      {renderDisplay()}
      
      {/* 3. STATUS LABEL */}
      {renderStatusLabel()}
      
      {/* CONFIG POPUP */}
      {renderConfig()}
    </Box>
  );
};

export default Section;
