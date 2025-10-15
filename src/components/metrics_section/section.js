import { useState, useEffect } from 'react';
import { Typography, Card, CardContent } from "@mui/material";
import { SectionTypes } from '../../constants/sectionTypes';
import { getData } from '../../mock-api';
import MetricWidget from '../widget/metric_widget';
import TableWidget from '../widget/table_widget';
import { useMasterMetadata } from '../../context/master_metadata_context';


const Section = ({ section }) => {
  console.log(section);
  const { masterMetadata, error } = useMasterMetadata();
  console.log(masterMetadata, "kkkkejeodi");

  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDataList = async (id) => {
    try {
      setLoading(true);
      let data = await getData(id);
      console.log(data, "this isssssssssssss");
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDataList(section.definitionId);
  }, [section.definitionId]);

  const definition = masterMetadata?.definitions?.find(
  def => def.definitionId === section.definitionId
);
  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
            {section.label}
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            (() => {
              switch (section.typeId) {
                case SectionTypes.METRIC:
                  (
                definition.config.widgets.map((widget, index) => {
                      const value = getValueByPath(responseData, widget.valueDefinition);
const data = { ...widget.label, value };
console.log(data , value , "test");

                  
                        return <MetricWidget key={index} widget={data} />;
                      })

                  );
                case SectionTypes.TABLE:
                  return (
                    <>TABLE - Data: {JSON.stringify(responseData)}</>
                  );
                default:
                  return null;
              }
            })()
          )}
        </CardContent>
      </Card>
    </>
  );
};
export default Section;

export function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
