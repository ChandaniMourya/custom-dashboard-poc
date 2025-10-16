import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
} from "@mui/material";

// Type for each metric
interface TableMetric {
  key: string;
  label: string;
}

// Props for TablePopup
interface TablePopupProps {
  open?: boolean;
  onClose?: () => void;
  rowLimit?: number;
  listOfMetrics?: TableMetric[];
  selectedMetric?: (string | TableMetric)[];
  onToggleChange?: (selectedKeys: string[], rowLimit: number) => void;
}

const TablePopup: React.FC<TablePopupProps> = ({
  open = false,
  onClose,
  rowLimit = 0,
  listOfMetrics = [],
  selectedMetric = [],
  onToggleChange,
}) => {
  // Convert mixed array to array of keys
  const toIdArray = (arr: (string | TableMetric)[]): string[] =>
    (arr || [])
      .map((m) => (typeof m === "string" ? m : m?.key))
      .filter(Boolean) as string[];

  const [selected, setSelected] = useState<string[]>(toIdArray(selectedMetric));
  const [rowLimitVal, setRowLimitVal] = useState<number>(rowLimit);

  // Keep internal state synced with external props
  useEffect(() => {
    setSelected(toIdArray(selectedMetric));
  }, [selectedMetric]);

  const handleToggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(updated);
  };

  const handleSave = () => {
    if (onToggleChange) onToggleChange(selected, rowLimitVal);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setSelected(toIdArray(selectedMetric)); // revert changes
    if (onClose) onClose();
  };

  const handleRowLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) setRowLimitVal(val);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Select Metrics</DialogTitle>

      <DialogContent dividers>
        <label htmlFor="rowLimit">Number of Rows to display</label>
        <input
          id="rowLimit"
          type="number"
          min={1}
          placeholder="Number of Rows"
          value={rowLimitVal}
          onChange={handleRowLimitChange}
        />
        {listOfMetrics.length > 0 ? (
          <List dense>
            {listOfMetrics.map((item) => (
              <ListItem
                key={item.key}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={selected.includes(item.key)}
                    onChange={() => handleToggle(item.key)}
                    color="primary"
                  />
                }
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No metrics available
          </Typography>
        )}
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TablePopup;