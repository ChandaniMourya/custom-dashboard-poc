import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Chip,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const TableDisplay = ({ 
  data = [],
  columns = [],
  rowLimit = 5
}) => {
  const formatValue = (value, column) => {
    if (value === null || value === undefined) return '--';
    
    // Format based on column type or value content
    if (typeof value === 'number') {
      if (column?.key === 'price') {
        return value.toFixed(2);
      } else if (column?.key === 'change') {
        const formatted = value > 0 ? `+${value.toFixed(4)}` : value.toFixed(4);
        return formatted;
      } else if (column?.key === 'volume') {
        return value.toLocaleString();
      }
    }
    
    return value.toString();
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'success';
    if (value < 0) return 'error';
    return 'default';
  };

  // Limit data to specified number of rows
  const limitedData = data.slice(0, rowLimit);

  return (
    <Card 
      sx={{ 
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <CardContent sx={{ p: 0 }}>

        {data.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No data available.
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Table sx={{ minWidth: 650 }} aria-label="data table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key}
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#333',
                        borderBottom: '2px solid #e0e0e0'
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {limitedData.map((row, index) => (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: '#f9f9f9' }
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell 
                        key={column.key}
                        sx={{ 
                          color: '#333',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        {column.key === 'change' && typeof row[column.key] === 'number' ? (
                          <Chip
                            label={formatValue(row[column.key], column)}
                            color={getChangeColor(row[column.key])}
                            size="small"
                            sx={{ 
                              fontWeight: 'bold',
                              minWidth: '80px'
                            }}
                          />
                        ) : (
                          <Typography variant="body2">
                            {formatValue(row[column.key], column)}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

      </CardContent>
    </Card>
  );
};

export default TableDisplay;
