import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MetricWidget from "../components/widget/metric_widget";
import MetricPopup from "../components/selection/metric_popup";
import { getData } from "../mock-api";
import { useMasterMetadata } from "../context/master_metadata_context";
import { IDefinition, ISection, IWidget, IWidgetConfig } from "../types/ISection";
// Import WidgetConfig type
interface MetricSectionProps {
  section: ISection;
}

const MetricSection: React.FC<MetricSectionProps> = ({ section }) => {
  const { masterMetadata } = useMasterMetadata();
  const [responseData, setResponseData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMetric, setSelectedMetric] = useState<IWidget[] | any>([]);
  const [definition, setDefinition] = useState<IDefinition | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleToggleChange = (selectedIds: string[]) => {
    const allWidgets = definition?.config?.widgets || [];
    const updated = allWidgets.filter(w => selectedIds.includes(w.widgetId));

    // Remove duplicates by widgetId
    const uniqueWidgets = Array.from(new Map(updated.map(w => [w.widgetId, w])).values());

    setSelectedMetric(uniqueWidgets);
  };

  const getDataResponse = async (id: string) => {
    try {
      setLoading(true);
      const data = await getData(id);
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!masterMetadata) return;

    const def = masterMetadata?.definitions?.find(
      d => d.definitionId === section.definition.definitionId
    );
    setDefinition(def || null);

    const enabledWidgets = def?.config.widgets.filter(widget =>
      section.config.enabled?.includes(widget.widgetId)
    ) || [];

    // Remove duplicates
    const uniqueWidgets = Array.from(new Map(enabledWidgets.map(w => [w.widgetId, w])).values());

    setSelectedMetric(uniqueWidgets);
  }, [masterMetadata, section.definition.definitionId]);

  useEffect(() => {
    getDataResponse(section.definition.definitionId);
  }, [section.definition.definitionId]);

  function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
            {section.config.label}
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setIsPopupOpen(true)}>
            Menu
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          definition?.config.widgets
            .filter(widget => selectedMetric.some(selected => selected.widgetId === widget.widgetId))
            .map((widget, index) => {
              const base = responseData?.[section.definition.definitionId] || {};
              const value = getValueByPath(base, widget.config.valueDefinition);
              const trendValue = widget.config.trend?.trendvalueDefinition
                ? getValueByPath(base, widget.config.trend.trendvalueDefinition)
                : '';

              return <MetricWidget
  key={widget.widgetId}
  data={{
    value,
    trendValue,
    config: {
      label: widget.label,
      trend: widget.config.trend,
    },
  }}
/>
;
            })
        )}

        {isPopupOpen && (
          <Box sx={{ mt: 2 }}>
            <MetricPopup
              open={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              selectedMetric={selectedMetric}
              listOfMetrics={definition?.config?.widgets || []}
              onToggleChange={handleToggleChange}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
