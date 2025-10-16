import { useState, useEffect } from 'react';
import { getData } from '../mock-api';
import { useMasterMetadata } from '../context/master_metadata_context';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import TableWidget from '../components/widget/table_widget';
import TablePopup from '../components/selection/table_popup';
import { ISection } from '../types/ISection';

// Column type
interface TableColumn {
  key: string;
  label: string;
}

// Definition type
interface TableDefinition {
  definitionId: string;
  valueDefinition: string;
  config: {
    columns: TableColumn[];
  };
}

interface TableSectionProps {
  section: ISection;
}

const TableSection: React.FC<TableSectionProps> = ({ section }) => {
  const { masterMetadata, error } = useMasterMetadata();
  const [responseData, setResponseData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedColumns, setSelectedColumns] = useState<TableColumn[]>([]);
  const [numberOfRows, setNumberOfRows] = useState<number | null>(section.tableRowLimit || null);
  const [definition, setDefinition] = useState<TableDefinition | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleToggleChange = (selectedKeys: string[], rowLimit: number) => {
    const allColumns = definition?.config.columns || [];
    const updated = allColumns.filter(col => selectedKeys.includes(col.key));
    setSelectedColumns(updated);
    setNumberOfRows(rowLimit);
  };

  const getDataList = async (id: string) => {
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

    const def = masterMetadata.definitions?.find(
      d => d.definitionId === section.definitionId
    ) as TableDefinition | undefined;

    if (!def) return;

    setDefinition(def);
    getDataList(section.definitionId);

    setNumberOfRows(section.tableRowLimit || null);

    const enabledKeys = section.config.enabled || [];
    const filteredColumns = def.config.columns.filter(col =>
      enabledKeys.includes(col.key)
    );
    setSelectedColumns(filteredColumns);
  }, [masterMetadata, section.definitionId]);

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
            const base = responseData[section.definitionId];
            const value = getValueByPath(base, definition.valueDefinition) as Record<string, any>[];
            const updateValue = numberOfRows ? value.slice(0, numberOfRows) : value;
            return <TableWidget columns={selectedColumns} rows={updateValue} />;
          })()
        )}

        {isPopupOpen && (
          <Box sx={{ mt: 2 }}>
            <TablePopup
              open={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              rowLimit={numberOfRows || 0}
              selectedMetric={selectedColumns}
              listOfMetrics={definition?.config.columns || []}
              onToggleChange={handleToggleChange}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TableSection;
