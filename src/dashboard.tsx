import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { MasterMetadataProvider } from "./context/master_metadata_context";
import { getDashboardMetadata } from "./mock-api";
import SectionRenderer from "./registry/sectionRenderer";
import { ISection } from "./types/ISection";

const Dashboard: React.FC<{ id?: string }> = ({ id = "dashboard123" }) => {
  const [dashboardSections, setDashboardSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const config = await getDashboardMetadata(id);
        if (isMounted) setDashboardSections(config?.sections || []);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => { isMounted = false; };
  }, [id]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;
  if (!dashboardSections.length) return <div>No sections found.</div>;

  return (
    <MasterMetadataProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
            Dashboard POC
          </Typography>
        </Box>

        {dashboardSections.map((section) => (
          <SectionRenderer key={section.config.sectionId} section={section} />
        ))}
      </Container>
    </MasterMetadataProvider>
  );
};

export default Dashboard;
