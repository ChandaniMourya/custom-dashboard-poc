

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const MetricWidget = ({ data}) => {
    console.log(data , "metricer");
    
  return (
     <Card
       variant="outlined"
       sx={{
         display: "inline-block", // makes the card only as wide as its content
         borderRadius: 2,
         boxShadow: 2,
         px: 3, // horizontal padding inside card
         py: 2, // vertical padding inside card
         m: 1, // margin between cards
         height: 120, // fixed height for consistent card sizes
         textAlign: "center",
         transition: "transform 0.2s ease, box-shadow 0.2s ease",
         "&:hover": {
           transform: "translateY(-4px)",
           boxShadow: 4,
         },
       }}
     >
      <CardContent sx={{ p: 0 }}> {/* remove default padding, we added custom above */}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {data.config.label}
        </Typography>

        <Box mt={1}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            {data.value}
          </Typography>
          {data.trendValue !== undefined && data.trendValue !== ''  && data.trendValue !== 0 && (
            <Box
              sx={{
                mt: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: data.trendValue > 0 
                  ? data.config?.trend?.positiveColor || '#00ff00'
                  : data.trendValue < 0 
                    ? data.config?.trend?.negativeColor || '#ff0000'
                    : null,
                display: 'inline-block',
                minWidth: '40px',
                textAlign: 'center'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {data.trendValue !== 0 ? `${data.trendValue}` : ''}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricWidget;
