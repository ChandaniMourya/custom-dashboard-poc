import React, { useState, useEffect } from "react";
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

// Define type for individual metric
interface MetricItem {
  widgetId: string;
  label: string;
}

// Props for MetricPopup
interface MetricPopupProps {
  open?: boolean;
  onClose?: () => void;
  listOfMetrics?: MetricItem[];
  selectedMetric?: (string | MetricItem)[];
  onToggleChange?: (selectedIds: string[]) => void;
}

const MetricPopup: React.FC<MetricPopupProps> = ({
  open = false,
  onClose,
  listOfMetrics = [],
  selectedMetric = [],
  onToggleChange,
}) => {
  // Helper to convert mixed array to array of widgetId strings
  const toIdArray = (arr: (string | MetricItem)[]): string[] =>
    (arr || [])
      .map((m) => (typeof m === "string" ? m : m?.widgetId))
      .filter(Boolean) as string[];

  const [selected, setSelected] = useState<string[]>(toIdArray(selectedMetric));

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
    if (onToggleChange) onToggleChange(selected);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setSelected(toIdArray(selectedMetric)); // revert changes
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Select Metrics</DialogTitle>

      <DialogContent dividers>
        {listOfMetrics.length > 0 ? (
          <List dense>
            {listOfMetrics.map((item) => (
              <ListItem
                key={item.widgetId}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={selected.includes(item.widgetId)}
                    onChange={() => handleToggle(item.widgetId)}
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

export default MetricPopup;
