import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { getDashboardMetadata, getDefinitionById } from "./mock-api";
import SectionRenderer from "./registry/sectionRenderer";
import { Config, ISection } from "./types/ISection";

const Dashboard: React.FC<{ id?: string }> = ({ id = "dashboard123" }) => {
  const [dashboardSections, setDashboardSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardWithDefinitions = async () => {
      try {
        const config = await getDashboardMetadata(id);
        const sections = config?.sections || [];
        const sectionsWithDefinitions = await Promise.all(
          sections.map(async (section: Config) => {
            try {
              const definition = await getDefinitionById(section.definitionId);
              console.log('Fetched definition:', definition);
              return {
                config: {...section},
                definition: definition
              } as ISection;
            } catch (err) {
              console.error(`Failed to fetch definition for ${section.definitionId}:`, err);
              return section as Config;
            }
          })
        );
        
        console.log('Sections with definitions:', sectionsWithDefinitions);
        
        if (isMounted) setDashboardSections(sectionsWithDefinitions);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardWithDefinitions();

    return () => { isMounted = false; };
  }, [id]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;
  if (!dashboardSections.length) return <div>No sections found.</div>;

  return (
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
  );
};

export default Dashboard;
