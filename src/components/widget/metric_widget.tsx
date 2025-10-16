import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

// Define the type for the data prop
interface TrendConfig {
  positiveColor?: string;
  negativeColor?: string;
}

interface MetricConfig {
  label: string;
  trend?: TrendConfig;
}

interface MetricData {
  value: string | number;
  trendValue?: number;
  config: MetricConfig;
}

interface MetricWidgetProps {
  data: MetricData;
}

const MetricWidget: React.FC<MetricWidgetProps> = ({ data }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "inline-block",
        borderRadius: 2,
        boxShadow: 2,
        px: 3,
        py: 2,
        m: 1,
        height: 120,
        textAlign: "center",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
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
          { typeof data.trendValue !== 'undefined' && data.trendValue !== 0 && (
            <Box
              sx={{
                mt: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor:
                  data.trendValue > 0
                    ? data.config.trend?.positiveColor || "#00ff00"
                    : data.trendValue < 0
                    ? data.config.trend?.negativeColor || "#ff0000"
                    : undefined,
                display: "inline-block",
                minWidth: "40px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {data.trendValue}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricWidget;
