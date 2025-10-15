import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const MetricDisplay = ({ 
  metrics = []
}) => {
  const enabledMetrics = metrics.filter(metric => metric.enabled);
  console.log(metrics);
  return (
    <Card 
      sx={{ 
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <CardContent sx={{ p: 0 }}>

        {enabledMetrics.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No metrics selected. Click "Configure" to select metrics to display.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {enabledMetrics.map((metric) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={metric.id}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: '#fafafa',
                    textAlign: 'center',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {metric.value || '--'}
                  </Typography>
                  {metric.change && (
                    <Chip
                      label={metric.change}
                      size="small"
                      sx={{ 
                        mt: 1, 
                        fontSize: '0.75rem',
                        backgroundColor: metric.trendColors ? 
                          (metric.trendValue > 0 ? metric.trendColors.positive :
                           metric.trendValue < 0 ? metric.trendColors.negative :
                           metric.trendColors.neutral) : '#e0e0e0',
                        color: metric.trendColors ? 
                          (metric.trendValue > 0 ? '#000' :
                           metric.trendValue < 0 ? '#fff' :
                           '#000') : '#666',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

      </CardContent>
    </Card>
  );
};

export default MetricDisplay;
