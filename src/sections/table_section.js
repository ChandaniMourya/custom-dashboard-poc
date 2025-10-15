import { useState, useEffect } from 'react';
import { getData } from '../mock-api';
import { useMasterMetadata } from '../context/master_metadata_context';
import { Box, Button, Card, CardContent, Table, Typography } from '@mui/material';
import TableWidget from '../components/widget/table_widget';
import { getValueByPath } from './metric_section';
import TablePopup from '../components/selection/table_popup';




const TableSection = ({ section }) => {
  const { masterMetadata, error } = useMasterMetadata();
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColumns, setSelectedColumns] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(null);
  const [definition, setDefinition] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleToggleChange = (selectedIds , rowLimit) => {
    const allColumns = definition.config.columns || [];
    const updated = allColumns.filter(w => selectedIds.includes(w.key));
    setSelectedColumns(updated);
    setNumberOfRows(rowLimit);
  };


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
    getDataList(section.definitionId);
    setNumberOfRows(section.tableRowLimit);
            const enabledKeys = section.config.enabled;
            const filteredColumns = definition.config.columns.filter(col =>
              enabledKeys.includes(col.key)
            );
            setSelectedColumns(filteredColumns);

  }, [masterMetadata]);


  useEffect(() => {

  }, [section.definitionId]);

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          definition && responseData && (() => {
             let base = responseData?.[section.definitionId];
            const value = getValueByPath(base, definition.valueDefinition);
            let updateValue = value.filter((item, index) => index < numberOfRows);
            console.log(updateValue);
            
            return <TableWidget columns={selectedColumns} rows={updateValue} />;
          })()
        )}
         {isPopupOpen && (
            <Box sx={{ mt: 2 }}>
              <TablePopup
                open={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                rowLimit={numberOfRows}
                selectedMetric={selectedColumns}
                listOfMetrics={definition?.config?.columns || []}
                onToggleChange={handleToggleChange}
              />
            </Box>
          )}
      </CardContent>
    </Card>
  );

};
export default TableSection;




