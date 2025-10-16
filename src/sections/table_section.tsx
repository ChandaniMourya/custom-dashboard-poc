import { useState, useEffect } from 'react';
import { getData } from '../mock-api';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import TableWidget from '../components/widget/table_widget';
import TablePopup from '../components/selection/table_popup';
import { Definition, ISection, TableDefinition, TableColumn } from '../types/ISection';

interface TableSectionProps {
  section: ISection<TableDefinition>;
}

const TableSection: React.FC<TableSectionProps> = ({ section }) => {
  const [responseData, setResponseData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedColumns, setSelectedColumns] = useState<TableColumn[]>([]);
  const [numberOfRows, setNumberOfRows] = useState<number | null>(section.config.tableRowLimit || null);
  const [definition, setDefinition] = useState<Definition<TableDefinition> | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleToggleChange = (selectedKeys: string[], rowLimit: number) => {
    const allColumns = definition?.config.columns || [];
    const updated = allColumns.filter((col: TableColumn) => selectedKeys.includes(col.key));
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

  function getValueByPath(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
  }

  useEffect(() => {
    setDefinition(section.definition as Definition<TableDefinition>);
    getDataList(section.definition.definitionId);

    setNumberOfRows(section.config.tableRowLimit || 0);

    const enabledKeys = section.config.enabled || [];
    const filteredColumns = section.definition?.config?.columns?.filter((col: TableColumn) =>
      enabledKeys.includes(col.key)
    ) || [];
    setSelectedColumns(filteredColumns);
  }, [section.definition.definitionId]);

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
          definition && responseData && (() => {
            const base = responseData[section.definition.definitionId];
            const value = getValueByPath(base, definition.config.valueDefinition || '') as Record<string, any>[];
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
