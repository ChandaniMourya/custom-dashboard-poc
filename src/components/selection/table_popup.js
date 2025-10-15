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

const TablePopup = ({
  open = false,
  onClose,
  rowLimit = 0,
  listOfMetrics = [],
  selectedMetric = [],
  onToggleChange,
}) => {
  const toIdArray = (arr) => (arr || []).map((m) => (typeof m === "string" ? m : m?.key)).filter(Boolean);
  const [selected, setSelected] = useState(toIdArray(selectedMetric));
  const [rowLimitVal, setRowLimitVal] = useState(rowLimit);
  // Keep internal state synced with external props
  useEffect(() => {
    setSelected(toIdArray(selectedMetric));
  }, [selectedMetric]);

  const handleToggle = (id) => {
    const updated = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(updated);
  };

  const handleSave = () => {
    if (onToggleChange) onToggleChange(selected , rowLimitVal);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setSelected(selectedMetric); // revert changes
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Select Metrics</DialogTitle>
      
      <DialogContent dividers>
        <label htmlFor="rowLimit">Number of Rows to display</label>
       <input id="rowLimit" type="number" min="1" placeholder="Number of Rows" value={rowLimitVal} onChange={(e) => setRowLimitVal(e.target.value)}></input>
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
