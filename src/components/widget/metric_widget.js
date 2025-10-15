// const MetricWidget = ({ 
//     widget
// }) => {
//     return (
//         <div>
//             <h3>{widget.label}</h3>
//             <p>{widget.value}</p>
//         </div>
//     );
// };

// export default MetricWidget;

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const MetricWidget = ({ widget }) => {
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
          {widget.label}
        </Typography>

        <Box mt={1}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            {widget.value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricWidget;
