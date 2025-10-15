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
  TextField,
  Divider,
} from '@mui/material';
import { SectionTypes } from '../../constants/sectionTypes';

const TableConfig = ({ 
  open, 
  onClose, 
  onSave, 
  title = "Table Configuration",
  subtitle = "Configure table settings",
  currentSection = null,
  definitionData = null,
  responseData = null
}) => {
  const [enabledItems, setEnabledItems] = useState([]);
  const [rowLimit, setRowLimit] = useState(5);

  // Get available columns from definition data
  const getAvailableItems = () => {
    if (!definitionData) return [];
    return definitionData.config?.columns || [];
  };

  const availableItems = getAvailableItems();

  // Update state when config popup opens
  useEffect(() => {
    if (open && currentSection) {
      // Get enabled columns from current section's tableColumns
      const enabledColumnKeys = currentSection.tableColumns?.map(col => col.key) || [];
      setEnabledItems(enabledColumnKeys);
      setRowLimit(currentSection.tableRowLimit || 5);
    }
  }, [open, currentSection]);

  const handleSave = () => {
    const updatedMetrics = {
      enabledColumns: enabledItems,
      allColumns: availableItems,
      tableRowLimit: rowLimit
    };
    onSave(updatedMetrics);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

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
            Configure Table Settings
          </Typography>
          
          {/* Row Limit Configuration */}
          <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: '#333', fontWeight: 'bold' }}>
              Number of Rows to Display
            </Typography>
            <TextField
              size="small"
              type="number"
              value={rowLimit}
              onChange={(e) => setRowLimit(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 100 }}
              sx={{ width: 120 }}
              label="Rows"
              variant="outlined"
            />
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              Set how many rows should be displayed in the table (1-100)
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 'bold' }}>
            Configure Table Columns
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            Select which columns to display in the table. Currently showing {enabledItems.length} of {availableItems.length} available columns.
          </Typography>
          
          <List sx={{ py: 0 }}>
            {availableItems.map((column) => {
              const isEnabled = enabledItems.includes(column.key);
              return (
                <ListItem 
                  key={column.key} 
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
                        {column.label}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Column Key: {column.key}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isEnabled}
                          onChange={() => {
                            if (isEnabled) {
                              setEnabledItems(enabledItems.filter(item => item !== column.key));
                            } else {
                              setEnabledItems([...enabledItems, column.key]);
                            }
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
              );
            })}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>
            Selected Columns ({enabledItems.length}):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {enabledItems.map((item) => {
              const column = availableItems.find(col => col.key === item);
              return (
                <Box
                  key={item}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: '#e3f2fd',
                    borderRadius: 1,
                    border: '1px solid #1976d2',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    {column?.label || item}
                  </Typography>
                </Box>
              );
            })}
          </Box>
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

export default TableConfig;
