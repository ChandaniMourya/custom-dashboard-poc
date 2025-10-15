import { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Box, Button } from "@mui/material";
import { SectionTypes } from '../constants/sectionTypes';
import { getData } from '../mock-api';
import MetricWidget from '../components/widget/metric_widget';
import TableWidget from '../components/widget/table_widget';
import { useMasterMetadata } from '../context/master_metadata_context';
import MetricDisplay from '../components/metrics_section/view';
import MetricPopup from '../components/selection/metric_popup';


const MetricSection = ({ section }) => {
  const { masterMetadata, error } = useMasterMetadata();
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seletedMetric, setSelectedMetric] = useState([]);
  const [definition, setDefinition] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const getDataList = async (id) => {
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
    getDataList(section.definitionId);
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
              Configure
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
                  const data = { label: widget.label, value: value };
                  return <MetricWidget key={index} widget={data} />;
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
