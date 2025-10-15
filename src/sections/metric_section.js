import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Box, Button } from "@mui/material";
import { getData } from '../mock-api';
import MetricWidget from '../components/widget/metric_widget';
import { useMasterMetadata } from '../context/master_metadata_context';
import MetricPopup from '../components/selection/metric_popup';


const MetricSection = ({ section }) => {
  const { masterMetadata, error } = useMasterMetadata();
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seletedMetric, setSelectedMetric] = useState([]);
  const [definition, setDefinition] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleToggleChange = (selectedIds) => {
    const allWidgets = definition?.config?.widgets || [];
    const updated = allWidgets.filter(w => selectedIds.includes(w.widgetId));
    setSelectedMetric(updated);
  };

  const getDataResponse = async (id) => {
    try {
      setLoading(true);
      let data = await getData(id);
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!masterMetadata) return;

    const definition = masterMetadata?.definitions?.find(
      def => def.definitionId === section.definitionId
    );
    setDefinition(definition);

    setSelectedMetric(
      definition?.config.widgets.filter(widget =>
        section.config.enabled?.includes(widget.widgetId)
      )
    );
  }, [masterMetadata]);


  useEffect(() => {
    getDataResponse(section.definitionId);
  }, [section.definitionId]);

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 2 }}>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
              {section.label}
            </Typography>
            <Button variant="outlined" size="small" onClick={() => setIsPopupOpen(true)}>
              Menu
            </Button>
          </Box>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            (() => {
              return definition.config.widgets.
                filter(widget => seletedMetric.some(selected => selected.widgetId === widget.widgetId)).map((widget, index) => {
                  const base = responseData?.[section.definitionId];
                  const value = getValueByPath(base, widget.valueDefinition);
                   let trendValue = ''
                  if(widget?.config?.trend?.valueDefinition){
                     trendValue = getValueByPath(base, widget.config.trend.valueDefinition);
                  }
                  const data = { value: value, trendValue: trendValue , config : widget};
                  return <MetricWidget key={index} data={data}  />;
                });
            })()
          )}
          {isPopupOpen && (
            <Box sx={{ mt: 2 }}>
              <MetricPopup
                open={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                selectedMetric={seletedMetric}
                listOfMetrics={definition?.config?.widgets || []}
                onToggleChange={handleToggleChange}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
};
export default MetricSection;

export function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
