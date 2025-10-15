import { useState, useEffect } from 'react';
import { getData } from '../mock-api';
import { useMasterMetadata } from '../context/master_metadata_context';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import TableWidget from '../components/widget/table_widget';




const TableSection = ({section}) => {
    const { masterMetadata, error } = useMasterMetadata();
      const [responseData, setResponseData] = useState(null);
      const [loading, setLoading] = useState(true);

        const [selectedColumns, setSelectedColumns] = useState([]);
        const [numberOfRows, setNumberOfRows] = useState(5);
        const [definition, setDefinition] = useState(null);

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
      
        //   setSelectedMetric(
        //     definition?.config.widgets.filter(widget =>
        //       section.config.enabled?.includes(widget.widgetId)
        //     )
        //   );

        }, [masterMetadata]);
      
      
        useEffect(() => {
          getDataList(section.definitionId);
        }, [section.definitionId]);

    //     return (

    //     <>
    //           <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
    //             <CardContent sx={{ p: 2 }}>
    //               <Box>
    //                 <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
    //                   {section.label}
    //                 </Typography>
    //                 <Button variant="outlined" size="small" onClick={() => setIsPopupOpen(true)}>
    //                   Configure
    //                 </Button>
    //               </Box>
        
    //               {loading ? (
    //                 <Typography>Loading...</Typography>
    //               ) : (
    //                 (() => {
    //                   return definition.config.widgets.
    //                     filter(widget => seletedMetric.some(selected => selected.widgetId === widget.widgetId)).map((widget, index) => {
    //                       const base = responseData?.[section.definitionId];
    //                       const value = getValueByPath(base, widget.valueDefinition);
    //                       const data = { label: widget.label, value: value };
    //                       return <MetricWidget key={index} widget={data} />;
    //                     });
    //                 })()
    //               )}
    //               {isPopupOpen && (
    //                 <Box sx={{ mt: 2 }}>
    //                   <MetricPopup
    //                     open={isPopupOpen}
    //                     onClose={() => setIsPopupOpen(false)}
    //                     selectedMetric={seletedMetric}
    //                     listOfMetrics={definition?.config?.widgets || []}
    //                   />
    //                 </Box>
    //               )}
    //             </CardContent>
    //           </Card>
    //         </>
    // );

    
return (
  <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
    <CardContent sx={{ p: 2 }}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
          {section.label}
        </Typography>
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        definition && responseData && (() => {
          // Assume responseData[section.definitionId] is an array of row objects
          const tableRows = responseData[section.definitionId] || [];
          // Use all keys from the first row as columns, or fallback to definition config
          const columns = definition.config?.columns || (tableRows[0] ? Object.keys(tableRows[0]) : []);
          return <TableWidget columns={columns} rows={tableRows} />;
        })()
      )}
    </CardContent>
  </Card>
);

};
export default TableSection;




