import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Column can have key and optional label
interface Column {
  key: string;
  label?: string;
}

// Row is a dynamic object where keys match column keys
type Row = Record<string, string | number | React.ReactNode>;

interface TableWidgetProps {
  columns: Column[] | string[];
  rows: Row[];
}

const TableWidget: React.FC<TableWidgetProps> = ({ columns, rows }) => {
  // Normalize columns if user passes array of strings
  const normalizedColumns: Column[] = columns.map((col) =>
    typeof col === "string" ? { key: col, label: col } : col
  );

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {normalizedColumns.map((col) => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              {normalizedColumns.map((col) => (
                <TableCell key={col.key}>{row[col.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableWidget;
