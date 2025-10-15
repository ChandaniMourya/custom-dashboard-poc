import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import Section from "./components/metrics_section/section";
import { MasterMetadataProvider, useMasterMetadata } from "./context/master_metadata_context";
import { getDashboardMetadata } from "./mock-api";

const Dashboard = ({ id = "dashboard123" }) => {
  const masterConfig = useMasterMetadata();
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      try {
        const config = await getDashboardMetadata(id);
        if (isMounted) setDashboardConfig(config);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboard();

    return () => {
      isMounted = false; // cleanup to avoid state updates on unmounted component
    };
  }, [id]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;
  if (!dashboardConfig) return <div>No dashboard configuration found.</div>;

  const sections = dashboardConfig.sections || [];

  return (
    <MasterMetadataProvider>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", color: "#333", mb: 2 }}
        >
          Dashboard POC
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dynamic metrics configuration and display system
        </Typography>
      </Box>

      {/* Render sections */}
      {sections.map((section) => (
        <Section key={section.sectionId} section={section} />
      ))}
    </Container>
    </MasterMetadataProvider>
  );
};

export default Dashboard;
