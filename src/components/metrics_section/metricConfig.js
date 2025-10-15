import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { SectionTypes } from '../../constants/sectionTypes';

const MetricConfig = ({ 
  open, 
  onClose, 
  onSave, 
  title = "Metric Configuration",
  subtitle = "Configure metrics to display",
  currentSection = null,
  definitionData = null,
  responseData = null
}) => {
  const [enabledItems, setEnabledItems] = useState([]);

  // Get available widgets from definition data
  const getAvailableItems = () => {
    if (!definitionData) return [];
    return definitionData.config?.widgets || [];
  };

  const availableItems = getAvailableItems();

  // Update state when config popup opens
  useEffect(() => {
    if (open && currentSection) {
      // Get enabled widgets from current section's widgets
      const enabledWidgetIds = currentSection.widgets?.filter(widget => widget.enabled).map(widget => widget.id) || [];
      setEnabledItems(enabledWidgetIds);
    }
  }, [open, currentSection]);

  // Get value from responseMetaData based on valueDefinition
  const getValueFromResponse = (widget) => {
    if (!responseData || !widget.valueDefinition) return '--';
    
    const definitionId = currentSection?.definitionId;
    if (!definitionId) return '--';
    
    // Parse the valueDefinition path (e.g., "query_result.a" -> ["query_result", "a"])
    const pathParts = widget.valueDefinition.split('.');
    let value = responseData[definitionId];
    
    // Navigate through the path
    for (const part of pathParts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return '--';
      }
    }
    
    if (value === null || value === undefined) return '--';
    return value.toString();
  };

  // Get trend value from responseMetaData based on trend valueDefinition
  const getTrendValueFromResponse = (widget) => {
    if (!responseData || !widget.config?.trend?.valueDefinition) return null;
    
    const definitionId = currentSection?.definitionId;
    if (!definitionId) return null;
    
    // Parse the trend valueDefinition path (e.g., "query_result.a_trend" -> ["query_result", "a_trend"])
    const pathParts = widget.config.trend.valueDefinition.split('.');
    let value = responseData[definitionId];
    
    // Navigate through the path
    for (const part of pathParts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return null;
      }
    }
    
    if (value === null || value === undefined) return null;
    return parseFloat(value);
  };

  const handleSave = () => {
    // Create metrics with values from responseMetaData
    const updatedMetrics = availableItems.map(item => {
      const isEnabled = enabledItems.includes(item.widgetId);
      const value = isEnabled ? getValueFromResponse(item) : '--';
      const trendValue = isEnabled ? getTrendValueFromResponse(item) : null;
      
      // Format trend value for display
      let changeDisplay = null;
      if (trendValue !== null) {
        const sign = trendValue > 0 ? '+' : '';
        changeDisplay = `${sign}${trendValue}%`;
      }
      
      return {
        id: item.widgetId,
        label: item.label,
        enabled: isEnabled,
        value: value,
        change: changeDisplay,
        trendValue: trendValue,
        category: currentSection?.definitionId || '',
        type: item.config?.unit || 'number',
        color: item.config?.color || '#1976d2',
        trendColors: item.config?.trend ? {
          positive: item.config.trend.positiveColor || '#00ff00',
          negative: item.config.trend.negativeColor || '#ff0000',
          neutral: item.config.trend.neutralColor || '#FFFF00'
        } : null
      };
    });
    onSave(updatedMetrics);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Filter to show only enabled items
  const getEnabledItems = () => {
    return availableItems.filter(item => enabledItems.includes(item.widgetId));
  };

  const enabledItemsList = getEnabledItems();

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Box sx={{ borderTop: '4px solid', borderColor: 'primary.main' }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
            {subtitle}
          </Typography>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 'bold' }}>
            Currently Enabled Metrics
          </Typography>
          {enabledItemsList.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No metrics are currently enabled for this section.
            </Typography>
          ) : (
            <List sx={{ py: 0 }}>
              {enabledItemsList.map((item) => (
                <ListItem 
                  key={item.widgetId} 
                  sx={{ 
                    px: 0, 
                    py: 1.5,
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ color: '#333', fontWeight: 500 }}>
                        {item.label}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Value: {getValueFromResponse(item)}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={true}
                          onChange={() => {
                            const newEnabledItems = enabledItems.filter(id => id !== item.widgetId);
                            setEnabledItems(newEnabledItems);
                          }}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#1976d2',
                              '& + .MuiSwitch-track': {
                                backgroundColor: '#1976d2',
                              },
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#ccc',
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 'bold' }}>
            Available Metrics to Enable
          </Typography>
          <List sx={{ py: 0 }}>
            {availableItems.filter(item => !enabledItems.includes(item.widgetId)).map((item) => (
              <ListItem 
                key={item.widgetId} 
                sx={{ 
                  px: 0, 
                  py: 1.5,
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Click to enable this metric
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={false}
                        onChange={() => {
                          setEnabledItems([...enabledItems, item.widgetId]);
                        }}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#1976d2',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#1976d2',
                            },
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: '#ccc',
                          },
                        }}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button 
          onClick={handleCancel}
          variant="outlined"
          sx={{
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetricConfig;
