// src/registry/sectionRegistry.ts
import MetricSection from '../sections/metric_section';
import TableSection from '../sections/table_section';

export const sectionRegistry: Record<string, React.FC<any>> = {
  metric: MetricSection,
  table: TableSection,
};
